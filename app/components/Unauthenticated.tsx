import { Link } from "@remix-run/react";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui";

export const Unauthenticated: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-2">Unauthenticated</CardTitle>
        <CardDescription>You must be logged in to continue</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link to="/sign-up">Sign Up</Link>
        </Button>
        <Button asChild variant="link">
          <Link to="/sign-in">Already Registered? Sign in here</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
