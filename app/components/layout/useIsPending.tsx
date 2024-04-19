import { useNavigation } from "@remix-run/react";

export const useIsPending = () => {
  const { state } = useNavigation();
  const isPending = Boolean(state === "submitting" || state === "loading");

  return { isPending };
};
