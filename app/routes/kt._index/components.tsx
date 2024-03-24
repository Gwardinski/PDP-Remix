import { cn } from "~/components/utils";

interface InfoCardProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
}
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "relative flex h-fit min-h-16 w-full flex-col items-center justify-center rounded-lg border border-gray-500 px-3 py-2 text-center ",
        className,
      )}
      {...rest}
    >
      <h6 className="absolute -top-2 rounded-md bg-gray-200 px-2 text-xs">
        {title}
      </h6>
      {children}
    </div>
  );
};
