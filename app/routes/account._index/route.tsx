import { useRouteLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui";
import { RootLoader } from "~/root";

const AccountViewPage = () => {
  const data = useRouteLoaderData<RootLoader>("root");
  const user = data?.user;

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{user?.name}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardHeader>
      <CardContent>
        {user?.createdAt && (
          <p>Created at: {format(user.createdAt, "dd/MM/yyyy - HH:mm")}</p>
        )}
        {user?.updatedAt && (
          <p>Last updated: {format(user.updatedAt, "dd/MM/yyyy - HH:mm")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountViewPage;
