import { IconBrandGithub } from "@tabler/icons-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui";

export const ProjectCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  github: string;
}> = ({ title, description, icon, link, github }) => {
  return (
    <Card className="flex h-full w-full flex-col">
      <a href={link} target="_blank">
        <CardHeader className="flex flex-col space-y-0">
          <CardTitle className="mb-2 hover:underline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex flex-col items-center justify-center">
          {icon}
        </CardContent>
      </a>

      <CardFooter className="mt-auto justify-evenly">
        <Button className="w-full" asChild>
          <a href={link} target="_blank">
            View App
          </a>
        </Button>
        <Button className="w-full" asChild>
          <a href={github} target="_blank">
            <IconBrandGithub />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
