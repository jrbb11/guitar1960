export const Skeleton = ({ className }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="aspect-[4/5] bg-gray-200 animate-pulse relative">
                <div className="absolute top-2 right-2 p-2 bg-white/80 rounded-full z-10 w-8 h-8" />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 flex-1 flex flex-col">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="mt-auto flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export const OrderItemSkeleton = () => {
    return (
        <div className="border rounded-lg p-4 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 bg-gray-200 rounded shrink-0" />
                    <div className="w-full">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="border-t pt-3 flex justify-between">
                <div className="w-32">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-8 w-24 rounded" />
            </div>
        </div>
    );
};

export const AddressCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-5 relative animate-pulse h-full">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-3 border-t mt-4 flex justify-end gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    );
};
