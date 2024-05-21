import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json, useActionData } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { isAuthenticated } from "~/api/auth";
import { dbRoundCreate } from "~/api/round";
import {
  RoundCreateFormType,
  RoundModalCreate,
  createRoundResolver,
} from "~/components/rounds/modals";

const BASE_PATH = "/library/rounds";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect("/");
  }
  return true;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // Validate Form Data
  const { receivedValues, errors, data } =
    await getValidatedFormData<RoundCreateFormType>(
      request,
      createRoundResolver,
    );
  if (errors) {
    return json({ errors, receivedValues, success: false, error: null }, 400);
  }

  // Create Question
  const uid = await isAuthenticated(request);
  if (!uid) {
    return redirect(BASE_PATH);
  }
  await dbRoundCreate({
    ...data,
    uid,
  });

  // Close Modal
  return redirect("/library/rounds");
};

const LibraryRoundsCreate = () => {
  const actionRes = useActionData<typeof action>();
  const actionError = actionRes?.error ?? "";

  return <RoundModalCreate basePath={BASE_PATH} actionError={actionError} />;
};

export default LibraryRoundsCreate;
