import { RangeDataType } from "@/context/app-context";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function calShrinkFactor(len: number) {
  return Math.ceil(len / 100);
}

export function sinkRangeData(data: RangeDataType[], shrinkFactor?: number) {
  if (!data) {
    return [];
  }
  if (!shrinkFactor) {
    shrinkFactor = calShrinkFactor(data.length);
  }

  let tempData: { downloads: number; day: string[] } = {
    downloads: 0,
    day: [],
  };
  const res = [];
  for (let i = 0; i < data.length; i++) {
    if (i !== 0 && i % shrinkFactor === 0) {
      res.push({
        downloads: tempData.downloads,
        day: tempData.day[0] + " - " + tempData.day[tempData.day.length - 1],
      });
      tempData = { downloads: 0, day: [] };
    }
    tempData.downloads += data[i].downloads;
    tempData.day.push(data[i].day);
  }
  if (tempData.downloads > 0) {
    res.push({
      downloads: tempData.downloads,
      day: tempData.day[0] + " - " + tempData.day[tempData.day.length - 1],
    });
  }

  return res;
}
