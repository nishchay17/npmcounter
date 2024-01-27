import { TIMEFRAMES } from "./fetchStats";

export default function isRangeValid(range: string | null): string | null {
  if (!range) {
    return range;
  }
  if (TIMEFRAMES[range]) {
    return range;
  }
  return null;
}
