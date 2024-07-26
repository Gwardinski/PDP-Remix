import { PropsWithChildren } from "react";

export const SettingsBox: React.FC<PropsWithChildren> = (props) => (
  <article
    className="flex w-full flex-col items-center justify-center gap-2 text-center"
    {...props}
  />
);

export const SettingsTitle: React.FC<PropsWithChildren> = (props) => (
  <h4 className="text-xl font-bold" {...props} />
);

export const SettingsRow: React.FC<PropsWithChildren> = (props) => (
  <div className="flex w-full items-center justify-center gap-4" {...props} />
);

export const SettingsValue: React.FC<PropsWithChildren> = (props) => (
  <h4 className="w-32 text-center text-xl font-semibold" {...props} />
);
