function pad(num: number) {
  return `${num < 10 ? "0" : ""}${num}`;
}

function getDateRange(daysOffset?: number) {
  let date = new Date();
  if (daysOffset) {
    date.setTime(date.getTime() + daysOffset * 1000 * 60 * 60 * 24);
  }
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )}`;
}

export const TIMEFRAMES: { [key: string]: string } = {
  "last day": "last-day",
  "last week": "last-week",
  "last month": "last-month",
  "last year": `${getDateRange(-365)}:${getDateRange()}`,
} as const;

type getStatsType = {
  package: string;
  range: string;
};
export default async function getStats(params: getStatsType) {
  if (!params.package) {
    throw new Error("No pkg name specified");
  }
  if (!params.range) {
    throw new Error("No range specified");
  }
  const range =
    TIMEFRAMES[params.range as keyof typeof TIMEFRAMES] || params.range;
  try {
    let newData = await fetch(
      `https://api.npmjs.org/downloads/range/${range}/${params.package}`
    )
      .then((res) => res.json())
      .then((json) => {
        return {
          data: json.downloads.filter(
            (it: { downloads: number }) => it.downloads > 0
          ),
          total: json.downloads.reduce(
            (acc: number, curr: { downloads: number; day: string }) =>
              acc + curr.downloads,
            0
          ),
          range,
          package: params.package,
        };
      });
    return newData;
  } catch (e) {
    return {
      data: [],
      total: 0,
      range: range,
      package: params.package,
    };
  }
}
