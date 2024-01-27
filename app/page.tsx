import Count from "@/components/count";
import Graph from "@/components/graph";
import Nav from "@/components/nav";
import { Search } from "@/components/search";
import getStats, { TIMEFRAMES } from "@/lib/fetchStats";

export default async function Home() {
  const data = await getStats({
    package: "react",
    range: TIMEFRAMES["last month"],
  });

  return (
    <div className="px-3 md:px-4 md:container sm:space-y-3">
      <Nav />
      <main className="border py-8 px-3 pb-3 md:py-10 lg:py-14 md:px-5 lg:px-9 rounded-2xl bg-primary-foreground space-y-8 sm:space-y-10 md:space-y-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center">
          Get count of npm <br /> packages quickly
        </h1>
        <Search />
        <Count count={data.total} />
        <Graph data={data} />
      </main>
    </div>
  );
}
