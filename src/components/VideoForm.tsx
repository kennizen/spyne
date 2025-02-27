import { getVideoMetadata } from "@/api/queries";
import { formatTime, handleGetVideoDuration } from "@/utils/helpers";
import { intoResultAsync } from "@/utils/typeHelpers";
import { ChangeEvent, FormEvent, memo, useState } from "react";
import { toast } from "react-toastify";
import { CornerDownLeft, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { VideoData } from "./Player";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface IProps {
  handleSetVideoData: (data: VideoData | null) => void;
  videoData: VideoData;
}

export const VideoForm = memo(({ handleSetVideoData, videoData }: IProps) => {
  // states
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // methods
  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[a-z]{2,})+(\/\S*)?$/i;

    if (!urlRegex.test(videoUrl)) {
      toast.error("Invalid video url");
      return;
    }

    setLoading(true);

    const [duration, durationErr] = await intoResultAsync(handleGetVideoDuration, videoUrl);
    const [metadata, metadataErr] = await intoResultAsync(getVideoMetadata, videoUrl);

    setLoading(false);

    if (durationErr || metadataErr) {
      console.error(durationErr || metadataErr);
      toast.error(durationErr?.message || metadataErr?.message);
      return;
    }

    handleSetVideoData({ duration, url: videoUrl, ...metadata });
  }

  function handleSetVideoUrl(e: ChangeEvent<HTMLInputElement>) {
    setVideoUrl(e.target.value);
    if (videoData !== null) handleSetVideoData(null);
  }

  return (
    <form onSubmit={handleOnSubmit} className="flex-1 flex flex-col bg-white p-4 rounded-md h-full gap-4">
      <div>
        <label htmlFor="link" className="text-sm">
          Video URL*
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="link"
            type="url"
            className="mt-1"
            placeholder="Enter/Paste video link here..."
            required
            value={videoUrl}
            onChange={handleSetVideoUrl}
          />
          <Button variant="secondary" type="submit">
            <CornerDownLeft size={18} />
          </Button>
        </div>
      </div>

      <div className={cn("rounded-md border shadow p-3 h-full", loading ? "flex items-center justify-center" : "")}>
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            <h2 className="text-sm font-semibold mb-4">Video Information</h2>
            <div className="grid grid-cols-1 text-sm gap-y-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">Content Type:</p>
                <p>{videoData.contentType}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Video Runtime:</p>
                <p>{formatTime(videoData.duration)}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Date Modified:</p>
                <p>
                  {videoData && videoData.lastModified ? format(new Date(videoData.lastModified), "dd/mm/yyyy") : "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Media Size:</p>
                <p>{videoData.size}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
});
