import { getServerPageContent } from '@/lib/data/serverPageContent';
import LocationsSection from '@/components/LocationsSection';

export default async function HomeLocations() {
    const saved = await getServerPageContent('home');

    return (
        <LocationsSection
            globalPresence={saved?.sections?.globalPresence}
            moreCountries={saved?.sections?.moreCountries}
            expandingMarkets={saved?.sections?.expandingMarkets}
        />
    );
}
