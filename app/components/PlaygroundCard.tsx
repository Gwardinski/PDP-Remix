import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui";

export const PlaygroundCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}> = ({ title, description, icon, link }) => {
  return (
    <Link to={link}>
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="flex flex-col space-y-0">
          <CardTitle className="mb-2 hover:underline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex flex-col items-center justify-center pb-10">
          {icon}
        </CardContent>
      </Card>
    </Link>
  );
};
