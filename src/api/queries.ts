import { formatFileSize } from "@/utils/helpers";
import { intoResultAsync } from "@/utils/typeHelpers";

export type VideoMetadata = {
  contentLength?: number;
  contentType: string;
  lastModified?: string;
  size?: string;
};

export async function getVideoMetadata(videoURL: string) {
  const [res, err] = await intoResultAsync(fetch, videoURL, {
    method: "HEAD",
  });

  if (err) throw new Error("Error fetching video metadata");

  const data: VideoMetadata = {
    contentType: "N/A",
    contentLength: 0,
    lastModified: "N/A",
    size: "N/A",
  };

  for (const [key, val] of res.headers.entries()) {
    switch (key) {
      case "content-length":
        data.contentLength = parseInt(val);
        break;
      case "content-type":
        data.contentType = val;
        break;
      case "last-modified":
        data.lastModified = val;
        break;
    }
  }

  data.size = data.contentLength ? formatFileSize(data.contentLength) : "N/A";

  return data;
}
