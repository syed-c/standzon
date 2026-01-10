import { getServerPageContent } from '@/lib/data/serverPageContent';
import UltraFastHero from '@/components/UltraFastHero';
import { sanitizeHtml } from '@/lib/utils/html';

export default async function HomeHero() {
    const saved = await getServerPageContent('home');

    const heroHeading = saved?.sections?.hero?.heading || "";
    const heroHeadingFont = saved?.sections?.hero?.headingFont || saved?.sections?.typography?.headingFont || "";
    const heroDescriptionRaw = saved?.sections?.hero?.description || "";
    const heroDescription = sanitizeHtml(heroDescriptionRaw);
    const heroBgImage = saved?.sections?.hero?.bgImage || '';
    const heroBgOpacity = (saved?.sections?.hero?.bgOpacity && typeof saved.sections.hero.bgOpacity === 'number') ? saved.sections.hero.bgOpacity : 0.25;

    return (
        <UltraFastHero
            headings={[heroHeading]}
            subtitle=""
            description={heroDescription}
            headingFont={heroHeadingFont}
            bgImage={heroBgImage}
            bgOpacity={heroBgOpacity}
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
            stats={[
                { value: "120+", label: "Cities Covered" },
                { value: "55+", label: "Countries Served" },
                { value: "1500+", label: "Expert Builders" },
            ]}
            buttons={[
                { text: "Get Free Quote →", isQuoteButton: true },
                { text: "Global Venues", href: "/exhibition-stands", variant: "outline" },
                { text: "Find Builders", href: "/builders", variant: "outline" },
            ]}
        />
    );
}
