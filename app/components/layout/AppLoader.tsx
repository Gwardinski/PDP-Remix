import { useIsPending } from "./useIsPending";

export const AppLoader: React.FC = () => {
  const { isPending } = useIsPending();

  return (
    <div
      className={`fixed top-0 z-10 h-1 w-full animate-pulse rounded-lg transition-all duration-300 ease-in-out ${isPending ? "bg-purple-800 dark:bg-orange-700" : "bg-transparent"}`}
    />
  );
};
