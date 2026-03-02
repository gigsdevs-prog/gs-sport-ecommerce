// ============================================
// GS SPORT - Skeleton Loader Components
// ============================================

'use client';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-neutral-100 rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-100 rounded w-3/4" />
        <div className="h-4 bg-neutral-100 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse h-[80vh] bg-neutral-100 rounded-lg" />
  );
}

export function BannerSkeleton() {
  return (
    <div className="animate-pulse h-[400px] bg-neutral-100 rounded-lg" />
  );
}

export function TextSkeleton({ width = 'w-full' }: { width?: string }) {
  return <div className={`animate-pulse h-4 bg-neutral-100 rounded ${width}`} />;
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-neutral-100 rounded-lg" />
      <div className="h-4 bg-neutral-100 rounded w-1/2 mt-3 mx-auto" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-neutral-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}
