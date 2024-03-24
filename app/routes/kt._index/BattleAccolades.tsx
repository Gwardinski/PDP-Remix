import { Card, CardHeader, CardTitle } from "~/components/ui";

export const BattleAccolades = () => {
  return (
    <section className="flex w-full flex-col gap-2">
      <h2 className="text-3xl">Battle Accolades</h2>
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Triumphant</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">2 Captures!</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Ferocious</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">25 Dmg Inflicted</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Undying</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">15 Dmg Taken</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Resilient</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">15 Dmg Averted</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Pathetic</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">3 Captures Lost</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Treacherous</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">5 Friendly Fire</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
        <Card className="h-fit">
          <CardHeader className="flex flex-col space-y-0 px-4 py-3 pr-6">
            <p className=" p-0 text-xs">Most</p>
            <CardTitle className="pb-2">Disappointing</CardTitle>
            <p className="text-sm">Unit Name</p>
            <p className="text-sm">10 shots missed</p>
            <p className="text-sm">Team Name</p>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};
