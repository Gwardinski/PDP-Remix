import { Card, CardHeader, CardTitle } from "~/components/ui";

export const BattleOverview = () => {
  return (
    <section className="flex w-full flex-col gap-2">
      <h2 className="text-3xl">Battle Overview</h2>
      <div className="flex gap-2 overflow-x-auto">
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0">
            <CardTitle className="mb-2">Player 1</CardTitle>
            <p className="text-lg">2 Points</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0">
            <CardTitle className="mb-2">Player 2</CardTitle>
            <p className="text-lg">3 Points</p>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};
