// Constants
const CACHE_DURATION_SECONDS = 24 * 60 * 60; // 1 day
const NPM_API_BASE_URL = "https://api.npmjs.org/downloads/range";

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

export default async function getStats(
  params: getStatsType,
  signal?: AbortSignal
) {
  if (!params.package) {
    throw new Error("No package name specified");
  }
  if (!params.range) {
    throw new Error("No range specified");
  }

  let range =
    TIMEFRAMES[params.range as keyof typeof TIMEFRAMES] || params.range;

  if (range === "all time") {
    range = `2012-01-01:${getDateRange()}`;
  }

  try {
    const response = await fetch(
      `${NPM_API_BASE_URL}/${range}/${params.package}`,
      {
        next: { revalidate: CACHE_DURATION_SECONDS },
        signal,
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Package not found");
      }
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    const json = await response.json();

    // Validate response structure
    if (!json.downloads || !Array.isArray(json.downloads)) {
      throw new Error("Invalid response format from npm API");
    }

    return {
      data: json.downloads.filter(
        (it: { downloads: number }) => it.downloads > 0
      ),
      total: json.downloads.reduce(
        (acc: number, curr: { downloads: number }) => acc + curr.downloads,
        0
      ),
      range,
      package: params.package,
    };
  } catch (error) {
    // Re-throw abort errors without modification
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    // Re-throw our custom errors
    if (error instanceof Error) {
      throw error;
    }
    // Wrap unknown errors
    throw new Error("Network error occurred while fetching package stats");
  }
}
