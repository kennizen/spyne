export function formatFileSize(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
}

export function formatTime(seconds: number) {
  if (seconds === 0) return "0 sec";

  const timeUnits = [
    { unit: "hr", value: 3600 },
    { unit: "min", value: 60 },
    { unit: "sec", value: 1 },
  ];

  let result = [];

  for (const { unit, value } of timeUnits) {
    const amount = Math.floor(seconds / value);
    if (amount > 0) {
      result.push(`${amount} ${unit}${amount > 1 ? "s" : ""}`);
      seconds %= value;
    }
  }

  return result.join(" ");
}

export function isValidTimestamp(timestamp: string) {
  const arr = timestamp.split(":");
  for (const time of arr) {
    if (time.length < 2) return false;
  }
  return true;
}

export function getTimestamp(duration: number) {
  const intervals = [3600, 60, 1];
  const res: string[] = [];
  let remainingSecs = duration;

  for (const intr of intervals) {
    const time = Math.floor(remainingSecs / intr);
    if (time > 9) res.push(`${time}`);
    else if (time > 0) res.push(`0${time}`);
    else res.push("00");
    remainingSecs = remainingSecs % intr;
  }

  return res.join(":");
}

export async function handleGetVideoDuration(URL: string): Promise<number> {
  return new Promise((res, rej) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = URL;

    video.onloadedmetadata = () => {
      res(video.duration);
      video.remove();
    };

    video.onerror = () => {
      rej("Error in getting video duration.");
      video.remove();
    };
  });
}
