import { useIsPending } from "./useIsPending";

export const AppLoader: React.FC = () => {
  const { isPending } = useIsPending();

  return (
    <div
      className={`h-1 w-full transition-all duration-300 ease-in-out ${isPending ? "bg-orange-400 dark:bg-orange-700" : "bg-transparent"}`}
    />
  );
};
