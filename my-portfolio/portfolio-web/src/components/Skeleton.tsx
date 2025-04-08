import { useThemeState } from "@/context/zustand";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  const { theme } = useThemeState();

  return (
    <div
      className={`animate-pulse rounded-lg ${
        theme === "dark" ? "bg-gray-800/30" : "bg-gray-200"
      } ${className}`}
    />
  );
};

export const TextSkeleton = ({ className = "" }: SkeletonProps) => {
  return <Skeleton className={`h-4 w-full ${className}`} />;
};

export const AvatarSkeleton = ({ className = "" }: SkeletonProps) => {
  return <Skeleton className={`h-12 w-12 rounded-full ${className}`} />;
};

export const CardSkeleton = ({ className = "" }: SkeletonProps) => {
  return <Skeleton className={`h-48 w-full ${className}`} />;
};
