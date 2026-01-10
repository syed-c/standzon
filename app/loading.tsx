import { HeroSkeleton } from '@/components/skeletons';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton is minimal/invisible or simulates header */}
            <div className="h-16 bg-white border-b border-gray-100 sticky top-0 z-50"></div>
            <HeroSkeleton />
        </div>
    );
}
