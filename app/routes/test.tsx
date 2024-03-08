import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function TestPage() {
  return <div className="h-full w-full bg-green-50">TEST PAGE</div>;
}
