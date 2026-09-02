import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase as anonSupabase } from '@/lib/supabase/client';
import { normalizeLead, rateLimit } from '@/lib/leads/normalize';

const supabase = supabaseAdmin || anonSupabase;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ASSIGNMENTS = 12;

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json().catch(() => ({}));
    const body = raw?.leadData && typeof raw.leadData === 'object' ? raw.leadData : raw || {};

    // Honeypot — a dedicated hidden field real users never see.
    if (body._hp || body._gotcha) {
      return NextResponse.json({ success: true, data: { leadId: 'ok', matchingBuilders: 0 } });
    }

    // Throttle abusive clients.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(`lead:${ip}`, 6, 60_000)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 },
      );
    }

    const lead = normalizeLead(body, { referrer: request.headers.get('referer') });

    if (!lead.company_name || lead.company_name === 'Not provided' || !EMAIL_RE.test(lead.contact_email)) {
      return NextResponse.json(
        { success: false, error: 'A company name and a valid email address are required.' },
        { status: 400 },
      );
    }

    // 1. Save the lead
    const { data: saved, error: insertError } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();

    if (insertError || !saved) {
      console.error('❌ lead insert failed:', insertError);
      return NextResponse.json(
        { success: false, error: 'Could not save your request. Please try again.', details: insertError?.message },
        { status: 500 },
      );
    }
    const leadId = saved.id as string;

    // 2. Match builders by location
    let matched: any[] = [];
    try {
      matched = await matchBuilders(lead);
    } catch (e) {
      console.error('⚠️ builder matching failed (lead still saved):', e);
    }

    // 3. Assign + notify
    let notificationsSent = 0;
    let emailsSent = 0;
    if (matched.length > 0) {
      const targets = matched.slice(0, MAX_ASSIGNMENTS);

      const assignments = targets.map((b) => ({
        lead_id: leadId,
        builder_id: b.id,
        status: 'assigned',
        notes: `Auto-matched by location (${lead.city !== 'Not specified' ? lead.city : lead.country}).`,
      }));
      const { error: aErr } = await supabase.from('lead_assignments').insert(assignments);
      if (aErr) console.error('⚠️ lead_assignments insert failed:', aErr.message);

      await supabase
        .from('leads')
        .update({ status: 'ASSIGNED', updated_at: new Date().toISOString() })
        .eq('id', leadId);

      // In-app notifications for builders that have a linked user account
      const notif = targets
        .filter((b) => b.user_id)
        .map((b) => ({
          user_id: b.user_id,
          title: 'New quote request',
          message: `${lead.company_name} is looking for a stand${lead.city !== 'Not specified' ? ` in ${lead.city}` : ''}${lead.country !== 'Not specified' ? `, ${lead.country}` : ''}.`,
          type: 'LEAD_RECEIVED',
          read: false,
          data: { leadId, city: lead.city, country: lead.country, budget: lead.budget },
        }));
      if (notif.length) {
        const { error: nErr } = await supabase.from('notifications').insert(notif);
        if (!nErr) notificationsSent = notif.length;
        else console.error('⚠️ notifications insert failed:', nErr.message);
      }

      // Only email builders who can actually act on the lead (claimed account or
      // verified). Unclaimed scraped profiles still get the assignment so they
      // see the backlog if/when they claim, but we don't cold-email them.
      const emailTargets = targets.filter((b) => b.user_id || b.verified).slice(0, 8);
      emailsSent = await sendBuilderEmails(emailTargets, lead, leadId).catch(() => 0);
    }

    return NextResponse.json({
      success: true,
      message:
        matched.length > 0
          ? `Request received. We matched ${matched.length} builder${matched.length === 1 ? '' : 's'} in your area.`
          : 'Request received. Our team will match you with builders shortly.',
      data: {
        leadId,
        matchingBuilders: matched.length,
        notificationsSent,
        emailsSent,
        qualifiedBuilders: matched.slice(0, 5).map((b) => ({
          id: b.id,
          name: b.company_name,
          city: b.headquarters_city,
          country: b.headquarters_country,
        })),
        routing: { success: true, buildersNotified: matched.length },
      },
    });
  } catch (error) {
    console.error('❌ Lead submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

async function matchBuilders(lead: {
  city: string;
  country: string;
  targeted_builder_id: string | null;
}) {
  // A builder-specific inquiry goes straight to that builder.
  if (lead.targeted_builder_id) {
    const { data } = await supabase
      .from('builder_profiles')
      .select('id, company_name, primary_email, contact_person, user_id, verified, headquarters_city, headquarters_country')
      .eq('id', lead.targeted_builder_id)
      .limit(1);
    return data || [];
  }

  const hasCity = lead.city && lead.city !== 'Not specified';
  const hasCountry = lead.country && lead.country !== 'Not specified';
  if (!hasCity && !hasCountry) return [];

  const select =
    'id, company_name, primary_email, contact_person, user_id, verified, headquarters_city, headquarters_country';

  // Builders that serve this location via builder_service_locations
  let serviceIds: string[] = [];
  try {
    let q = supabase.from('builder_service_locations').select('builder_id');
    if (hasCity) q = q.ilike('city', `%${lead.city.toLowerCase()}%`);
    else q = q.ilike('country', `%${lead.country.toLowerCase()}%`);
    const { data } = await q.limit(500);
    serviceIds = Array.from(new Set((data || []).map((r: any) => r.builder_id).filter(Boolean))).slice(0, 200);
  } catch {
    /* ignore */
  }

  const or: string[] = [];
  if (hasCity) or.push(`headquarters_city.ilike.%${lead.city.toLowerCase()}%`);
  if (hasCountry) or.push(`headquarters_country.ilike.%${lead.country.toLowerCase()}%`);
  if (serviceIds.length) or.push(`id.in.(${serviceIds.join(',')})`);
  if (!or.length) return [];

  const { data, error } = await supabase
    .from('builder_profiles')
    .select(select)
    .or(or.join(','))
    .order('premium_member', { ascending: false })
    .order('verified', { ascending: false })
    .limit(50);

  if (error) {
    console.error('⚠️ matchBuilders query error:', error.message);
    return [];
  }
  return data || [];
}

async function sendBuilderEmails(builders: any[], lead: any, leadId: string): Promise<number> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    console.log('ℹ️ SMTP not configured — skipping builder emails (lead saved + assigned).');
    return 0;
  }

  let nodemailer: any;
  try {
    nodemailer = require('nodemailer');
  } catch {
    return 0;
  }
  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  const from = process.env.FROM_EMAIL || user;
  const dash = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://standszone.com'}/builder/dashboard`;
  let sent = 0;

  for (const b of builders) {
    const to = b.primary_email;
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) continue;
    try {
      await transporter.sendMail({
        from,
        to,
        subject: `New quote request — ${lead.company_name}`,
        text: [
          `${b.contact_person || b.company_name},`,
          '',
          `A new quote request matches your coverage area.`,
          '',
          `Company:   ${lead.company_name}`,
          `Location:  ${[lead.city, lead.country].filter((v) => v && v !== 'Not specified').join(', ') || 'Not specified'}`,
          `Show:      ${lead.trade_show_name}`,
          `Stand:     ${lead.stand_size ? `${lead.stand_size} sqm` : 'Not specified'}`,
          `Budget:    ${lead.budget}`,
          `Timeline:  ${lead.timeline}`,
          '',
          `View and respond in your dashboard: ${dash}`,
        ].join('\n'),
      });
      sent++;
    } catch (e) {
      console.error(`⚠️ email to ${to} failed:`, (e as Error).message);
    }
  }
  return sent;
}
