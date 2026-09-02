import type { ServiceDetailContent } from '@/components/ServiceDetailPage';

const GET_QUOTE = { buttonText: 'Get a Quote', buttonLink: '/quote' };
const CTA_BUTTONS = [
  { text: 'Get Free Quotes', href: '/quote' },
  { text: 'Browse Builders', href: '/builders' },
];

export const customBoothContent: ServiceDetailContent = {
  cmsPath: '/custom-booth',
  cmsKeys: { hero: 'hero', whyChoose: 'whyChooseCustom', process: 'designProcess', services: 'customDesignServices', cta: 'customBoothCta' },
  badge: 'Custom Exhibition Stands',
  heroHeading: 'Custom Exhibition Stand Design',
  heroHighlight: 'and Build',
  heroDescription: 'Work with builders who design your stand from a blank sheet, shaped around your products, your visitor journey and the space you have booked. Compare quotes from vetted custom stand builders within 24 hours.',
  stats: [
    { icon: 'calendar', value: '24h', label: 'Quote Time' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.8/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '5,000+', label: 'Stands Delivered' },
  ],
  whyChoose: {
    heading: 'Why Build a Custom Stand',
    paragraph: 'A custom stand is planned around how you want visitors to move, what you need to demonstrate and the story you want to tell. Nothing is forced to fit a standard kit.',
    features: [
      { heading: 'Designed around your brand', paragraph: 'Layout, materials and finishes follow your brand guidelines rather than a template, so the stand looks and feels like you.' },
      { heading: 'Better use of your space', paragraph: 'Traffic flow, meeting areas and storage are planned for your exact stand size and its position on the floor plan.' },
      { heading: 'Room for real experiences', paragraph: 'Product demos, hospitality, screens and interactive zones are built in from the first sketch instead of added later.' },
      { heading: 'Built to be reused', paragraph: 'A well made custom stand can be re-skinned and reconfigured for future shows, which lowers your cost over time.' },
    ],
  },
  process: {
    heading: 'How a Custom Stand Comes Together',
    paragraph: 'One team stays with your project from the first conversation to the moment the stand is handed over on site.',
    steps: [
      { heading: 'Brief and discovery', paragraph: 'We review your goals, budget, show details and brand assets before any design work begins.' },
      { heading: 'Concept and 3D design', paragraph: 'You see the stand in 3D, walk through the layout and sign off the look before production starts.' },
      { heading: 'Production and quality check', paragraph: 'The stand is built and inspected in the workshop, with a pre-build assembly where the project needs one.' },
      { heading: 'Delivery and installation', paragraph: 'Certified crews install on site, provide show-day support and manage the dismantle afterwards.' },
    ],
  },
  services: {
    heading: 'Custom Stand Packages',
    paragraph: 'Choose how much design input and finish your show and budget call for.',
    cards: [
      { title: 'Concept and Design', description: 'Design work only, so you can take approved drawings to your own contractor.', price: '$2,000', badge: '', features: ['Brand and objectives review', 'Space planning', '3D concept visuals', 'Material and finish schedule'], ...GET_QUOTE },
      { title: 'Full Custom Build', description: 'End to end design, fabrication and installation for a one of a kind stand.', price: '$15,000', badge: 'Most Requested', features: ['Bespoke structure and joinery', 'Custom graphics and lighting', 'Interactive and AV integration', 'On-site installation and support'], ...GET_QUOTE },
      { title: 'Reusable Custom System', description: 'A custom look built on a modular frame you can rebuild for several shows.', price: '$8,000', badge: '', features: ['Custom-designed modular frame', 'Multiple layout options', 'Flat-pack transport', 'Lower cost per show'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Ready to Start Your Custom Stand',
    paragraph: 'Tell us about your show and we will match you with custom stand builders who already work in that market.',
    buttons: CTA_BUTTONS,
  },
};

export const boothRentalContent: ServiceDetailContent = {
  cmsPath: '/booth-rental',
  cmsKeys: { section: 'boothRental', hero: 'hero', whyChoose: 'whyChoose', process: 'process', services: 'services', cta: 'cta' },
  badge: 'Exhibition Stand Rental',
  heroHeading: 'Exhibition Booth Rental',
  heroHighlight: 'Flexible and Cost Effective',
  heroDescription: 'Rent a branded, professional stand without paying to own, store and ship it. Compare booth rental quotes from verified suppliers in your show city.',
  stats: [
    { icon: 'calendar', value: '24h', label: 'Quote Time' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.7/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '3,000+', label: 'Rentals Fulfilled' },
  ],
  whyChoose: {
    heading: 'Why Rent Your Exhibition Stand',
    paragraph: 'Renting keeps your costs predictable and removes the storage and logistics that come with owning a stand, while still giving you a polished presence on the floor.',
    features: [
      { heading: 'Lower upfront cost', paragraph: 'You pay for the show you are doing now, not for a structure that sits in a warehouse between events.' },
      { heading: 'No storage or shipping', paragraph: 'The supplier holds, maintains and transports the system, so there is nothing for your team to manage.' },
      { heading: 'Change size each show', paragraph: 'Scale the same rental system up or down as your stand space and budget change from event to event.' },
      { heading: 'Fresh graphics every time', paragraph: 'The frame is reused but your printed graphics are new, so the stand always looks current.' },
    ],
  },
  process: {
    heading: 'How Booth Rental Works',
    paragraph: 'Pick a layout, send your artwork and the supplier handles delivery, build and dismantle.',
    steps: [
      { heading: 'Choose a layout', paragraph: 'Select a rental system and size that suits your space, then confirm any add-ons such as storage or AV.' },
      { heading: 'Send your graphics', paragraph: 'Provide print-ready artwork or ask the supplier to prepare it from your brand assets.' },
      { heading: 'Delivery and build', paragraph: 'The crew installs the stand before the show opens and checks every panel, light and fitting.' },
      { heading: 'Show support and dismantle', paragraph: 'On-site help during the event, then the supplier removes and stores the system afterwards.' },
    ],
  },
  services: {
    heading: 'Booth Rental Packages',
    paragraph: 'Modular rental systems that scale from small inline stands to large island builds.',
    cards: [
      { title: 'Inline Rental', description: 'A clean, branded stand for a standard inline space of around 9 to 18 square metres.', price: '$1,800', badge: '', features: ['Modular wall system', 'Printed backwall graphics', 'Lighting and flooring', 'Install and dismantle'], ...GET_QUOTE },
      { title: 'Corner and Peninsula', description: 'A more open layout with better sightlines for corner or peninsula spaces.', price: '$4,500', badge: 'Most Requested', features: ['Two or three open sides', 'Counter and storage room', 'Feature lighting', 'Furniture package'], ...GET_QUOTE },
      { title: 'Island Rental', description: 'A large, freestanding rental build for island spaces of 36 square metres and up.', price: '$9,000', badge: '', features: ['Overhead structure or hanging sign', 'Meeting and demo areas', 'Full AV and power plan', 'Dedicated on-site supervisor'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Ready to Rent Your Exhibition Stand',
    paragraph: 'Share your show and stand size and we will connect you with rental suppliers who cover that venue.',
    buttons: CTA_BUTTONS,
  },
};

export const graphicsPrintingContent: ServiceDetailContent = {
  cmsPath: '/trade-show-graphics-printing',
  cmsKeys: { section: 'graphicsPrinting', hero: 'hero', whyChoose: 'whyChoose', process: 'process', services: 'services', cta: 'cta' },
  badge: 'Exhibition Graphics and Print',
  heroHeading: 'Trade Show Graphics and Printing',
  heroHighlight: 'Large Format Done Right',
  heroDescription: 'Colour-accurate large-format graphics, fabric backwalls, stand wraps and wayfinding for exhibitions. Get quotes from exhibition print specialists with turnaround as fast as 48 hours.',
  stats: [
    { icon: 'calendar', value: '48h', label: 'Turnaround' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.8/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '1,200+', label: 'Print Jobs' },
  ],
  whyChoose: {
    heading: 'Why Graphics Quality Matters on a Stand',
    paragraph: 'Sharp, colour-accurate graphics are what stop visitors in the aisle and make your stand read well in photos and video.',
    features: [
      { heading: 'Colour you can trust', paragraph: 'Proofing and calibrated printing keep your brand colours consistent across every panel and material.' },
      { heading: 'Made for the venue', paragraph: 'Materials and fixings are chosen for the hall, the lighting and the rigging rules at your specific show.' },
      { heading: 'Readable from a distance', paragraph: 'Type sizes, contrast and hierarchy are set so your message lands from across the aisle, not just up close.' },
      { heading: 'Fast reprints', paragraph: 'Artwork is kept on file, so a damaged panel or a last-minute change can be reprinted and shipped quickly.' },
    ],
  },
  process: {
    heading: 'Our Graphics and Print Process',
    paragraph: 'Artwork check, colour proofing, production and on-site fitting, handled from start to finish.',
    steps: [
      { heading: 'Artwork and specification', paragraph: 'We check your files for resolution, bleed and colour, and confirm sizes against the stand drawings.' },
      { heading: 'Proofing', paragraph: 'You approve a printed or digital proof so there are no surprises on colour or scale.' },
      { heading: 'Production', paragraph: 'Panels, fabrics and rigid boards are printed, finished and packed for transport.' },
      { heading: 'Fitting and support', paragraph: 'Graphics are fitted on site or shipped with clear fitting instructions for your build crew.' },
    ],
  },
  services: {
    heading: 'Graphics and Print Packages',
    paragraph: 'From a single backwall to a full stand wrap with wayfinding and hospitality print.',
    cards: [
      { title: 'Essential Graphics', description: 'Core branding for a small stand or a refresh of existing panels.', price: '$300', badge: '', features: ['Backwall or header graphics', 'Standard materials', 'File check and proof', 'Fast turnaround'], ...GET_QUOTE },
      { title: 'Full Stand Graphics', description: 'A coordinated set of graphics for the whole stand, printed on premium media.', price: '$800', badge: 'Most Requested', features: ['Fabric and rigid panels', 'Feature wall or lightbox', 'Colour proofing', 'Fitting guidance'], ...GET_QUOTE },
      { title: 'Graphics and Wayfinding', description: 'Stand graphics plus hanging signs, floor vinyl and directional signage.', price: '$1,500', badge: '', features: ['Hanging sign or banner', 'Floor and window graphics', 'Hospitality and menu print', 'On-site fitting'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Ready to Print Your Stand Graphics',
    paragraph: 'Send your artwork or brand files and we will match you with exhibition print specialists near your venue.',
    buttons: CTA_BUTTONS,
  },
};

export const installationDismantleContent: ServiceDetailContent = {
  cmsPath: '/trade-show-installation-and-dismantle',
  cmsKeys: { section: 'installationDismantle', hero: 'hero', whyChoose: 'whyChoose', process: 'process', services: 'services', cta: 'cta' },
  badge: 'Installation and Dismantle',
  heroHeading: 'Trade Show Installation and Dismantle',
  heroHighlight: 'On-Time Build, Clean Teardown',
  heroDescription: 'Experienced install and dismantle crews who know venue rules, labour requirements and load-in windows, so your stand is ready before the doors open. Get matched with vetted crews and clear, itemised quotes.',
  stats: [
    { icon: 'calendar', value: '24h', label: 'Quote Time' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.8/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '4,500+', label: 'Builds Completed' },
  ],
  whyChoose: {
    heading: 'Why Use a Professional Install and Dismantle Crew',
    paragraph: 'The people who build your stand set the tone for the whole show. A crew that knows the venue avoids delays, fines and rushed work on the last night.',
    features: [
      { heading: 'They know the venue', paragraph: 'Local crews understand the rules at each hall on rigging, electrics, forklifts and working hours.' },
      { heading: 'Planned load-in', paragraph: 'Freight, dock times and build sequence are booked in advance so your stand is not waiting in a queue.' },
      { heading: 'Fewer people to manage', paragraph: 'A single supervisor runs the crew and reports to you, so your team is not chasing labour on the floor.' },
      { heading: 'Compliant dismantle', paragraph: 'The stand comes down safely and on schedule, with waste handled the way the venue requires.' },
    ],
  },
  process: {
    heading: 'Our Install and Dismantle Process',
    paragraph: 'Pre-show planning, a supervised build, show-day cover and a compliant dismantle.',
    steps: [
      { heading: 'Pre-show planning', paragraph: 'We review your stand drawings, the venue manual and the show schedule to build a labour and freight plan.' },
      { heading: 'Load-in and build', paragraph: 'The crew receives freight, assembles the stand and completes electrical, AV and graphics fitting.' },
      { heading: 'Show-day support', paragraph: 'A technician is on call during the event for repairs, adjustments and daily checks.' },
      { heading: 'Dismantle and out', paragraph: 'The stand is packed, freight is dispatched and the space is cleared within the move-out window.' },
    ],
  },
  services: {
    heading: 'Install and Dismantle Packages',
    paragraph: 'From a labour-only crew for a simple system to full turnkey supervision for a custom island.',
    cards: [
      { title: 'Labour Only', description: 'A skilled crew to build and dismantle a stand you or your supplier have specified.', price: '$60/hr', badge: '', features: ['Build and dismantle labour', 'Basic tools and equipment', 'Works to your drawings', 'Ideal for modular systems'], ...GET_QUOTE },
      { title: 'Supervised Build', description: 'A crew plus a supervisor who coordinates freight, trades and the venue.', price: '$2,500', badge: 'Most Requested', features: ['Dedicated on-site supervisor', 'Freight and dock coordination', 'Electrical and AV fitting', 'Daily show-day checks'], ...GET_QUOTE },
      { title: 'Turnkey I&D', description: 'Full management of install and dismantle for a large or complex custom stand.', price: '$6,000', badge: '', features: ['Full project supervision', 'Multi-trade coordination', 'Rigging and heavy lifts', 'Storage and return logistics'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Need a Crew for Your Next Show',
    paragraph: 'Give us the venue and your stand details and we will match you with install and dismantle crews who work there.',
    buttons: CTA_BUTTONS,
  },
};

export const projectManagementContent: ServiceDetailContent = {
  cmsPath: '/trade-show-project-management',
  cmsKeys: { section: 'projectManagement', hero: 'hero', whyChoose: 'whyChoose', process: 'process', services: 'services', cta: 'cta' },
  badge: 'Exhibition Project Management',
  heroHeading: 'Trade Show Project Management',
  heroHighlight: 'One Point of Contact',
  heroDescription: 'A dedicated project manager owns your timeline, budget, suppliers and on-site logistics, so your team can focus on visitors. Get matched with experienced exhibition project managers.',
  stats: [
    { icon: 'calendar', value: '24h', label: 'Quote Time' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.9/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '800+', label: 'Projects Managed' },
  ],
  whyChoose: {
    heading: 'Why Hire an Exhibition Project Manager',
    paragraph: 'Exhibitions have a lot of moving parts and a fixed deadline. A project manager keeps every supplier, cost and decision in one place.',
    features: [
      { heading: 'One person accountable', paragraph: 'Design, build, print, AV, freight and staff are all coordinated by a single manager who reports to you.' },
      { heading: 'The budget stays visible', paragraph: 'Costs are tracked against the plan from the first quote to the final invoice, with no surprises at the end.' },
      { heading: 'The timeline holds', paragraph: 'Every deadline for artwork, freight and approvals is scheduled and chased so nothing slips.' },
      { heading: 'Problems handled on site', paragraph: 'If something goes wrong during build or show days, your manager deals with it rather than passing it back to you.' },
    ],
  },
  process: {
    heading: 'Our Project Management Process',
    paragraph: 'A clear plan, coordinated suppliers and someone on site who owns the outcome.',
    steps: [
      { heading: 'Brief and budget', paragraph: 'We agree your objectives, stand space, budget and the key dates for the show.' },
      { heading: 'Plan and suppliers', paragraph: 'Design, build, print and logistics suppliers are briefed, quoted and booked against the schedule.' },
      { heading: 'Build coordination', paragraph: 'Your manager runs the production timeline, approvals and freight so the stand is ready on time.' },
      { heading: 'On-site and wrap-up', paragraph: 'Supervision through build, show days and dismantle, followed by a cost and performance report.' },
    ],
  },
  services: {
    heading: 'Project Management Packages',
    paragraph: 'From coordinating a single show to running a full multi-market exhibition programme.',
    cards: [
      { title: 'Single Show', description: 'End to end management of one exhibition, from brief to post-show report.', price: '$1,500', badge: '', features: ['Supplier coordination', 'Timeline and budget tracking', 'Approvals management', 'Post-show summary'], ...GET_QUOTE },
      { title: 'Show plus On-Site', description: 'Full management with a manager present through build, show days and dismantle.', price: '$3,500', badge: 'Most Requested', features: ['Everything in Single Show', 'On-site supervision', 'Daily reporting to your team', 'Issue resolution on the floor'], ...GET_QUOTE },
      { title: 'Programme Management', description: 'Ongoing management of several shows across the year with shared assets.', price: 'Custom', badge: '', features: ['Multi-show calendar', 'Shared stand and asset planning', 'Consolidated reporting', 'One account team'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Ready to Hand Off the Logistics',
    paragraph: 'Tell us about your show and we will match you with exhibition project managers who have run events like yours.',
    buttons: CTA_BUTTONS,
  },
};

export const renderingConceptContent: ServiceDetailContent = {
  cmsPath: '/3d-rendering-and-concept-development',
  cmsKeys: { section: 'renderingConcept', hero: 'hero', whyChoose: 'whyChoose', process: 'process', services: 'services', cta: 'cta' },
  badge: '3D Design and Concepts',
  heroHeading: '3D Rendering and Concept Development',
  heroHighlight: 'See It Before You Build It',
  heroDescription: 'Photoreal 3D visuals that let you approve layout, branding and lighting and get everyone aligned before any budget is committed. Get concept and rendering quotes from exhibition design studios.',
  stats: [
    { icon: 'calendar', value: '3-5 days', label: 'First Concept' },
    { icon: 'map-pin', value: '60+', label: 'Countries' },
    { icon: 'users', value: '4.8/5', label: 'Client Rating' },
    { icon: 'chart-line', value: '2,000+', label: 'Concepts Created' },
  ],
  whyChoose: {
    heading: 'Why Start With 3D and Concepts',
    paragraph: 'A 3D concept turns a rough idea into something the whole team can react to, long before you commit to production.',
    features: [
      { heading: 'Decisions get easier', paragraph: 'Stakeholders can see the stand from every angle, so feedback is specific and approvals come faster.' },
      { heading: 'Catch issues early', paragraph: 'Sightlines, storage, meeting space and traffic flow are tested on screen, not discovered on site.' },
      { heading: 'Better cost control', paragraph: 'A clear concept lets builders quote accurately, which reduces change orders once production starts.' },
      { heading: 'Stronger internal buy-in', paragraph: 'A polished visual is far easier to take to leadership than a floor plan and a moodboard.' },
    ],
  },
  process: {
    heading: 'Our 3D and Concept Process',
    paragraph: 'A short brief, a first concept in days, then focused revisions and production-ready output.',
    steps: [
      { heading: 'Brief and references', paragraph: 'We agree your goals, stand space, must-have zones and the look you are aiming for.' },
      { heading: 'First 3D concept', paragraph: 'You receive a set of rendered views showing layout, branding and materials.' },
      { heading: 'Revisions', paragraph: 'Two to three rounds of changes refine the design until it is signed off.' },
      { heading: 'Handover', paragraph: 'Final renders plus technical drawings that a builder can quote and produce from.' },
    ],
  },
  services: {
    heading: '3D and Concept Packages',
    paragraph: 'From a single hero render to a full concept deck with a walkthrough animation.',
    cards: [
      { title: 'Hero Render', description: 'One high-quality rendered view of an agreed stand design.', price: '$500', badge: '', features: ['One camera angle', 'Branded and lit', 'One revision round', 'Web and print resolution'], ...GET_QUOTE },
      { title: 'Concept Set', description: 'A full concept with multiple views, layout options and material choices.', price: '$1,200', badge: 'Most Requested', features: ['Three to five rendered views', 'Two layout options', 'Material and finish board', 'Up to three revision rounds'], ...GET_QUOTE },
      { title: 'Concept and Walkthrough', description: 'A concept set plus an animated walkthrough for presentations.', price: '$2,500', badge: '', features: ['Everything in Concept Set', '20 to 30 second animation', 'Presentation-ready deck', 'Production drawings included'], ...GET_QUOTE },
    ],
  },
  cta: {
    heading: 'Ready to Visualise Your Stand',
    paragraph: 'Share your brief and we will match you with exhibition design studios that produce concepts and 3D renders.',
    buttons: CTA_BUTTONS,
  },
};
