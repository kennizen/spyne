import { InputMask } from "@react-input/mask";
import { Plus, Save } from "lucide-react";
import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { getTimestamp, isValidTimestamp } from "@/utils/helpers";
import { VideoCaption } from "./Player";

interface IProps {
  videoDuration: number | null;
  handleAddCaption: (data: VideoCaption) => void;
  handlePauseVideo: () => void;
}

const INIT_STATE: VideoCaption = {
  caption: "",
  timestamp: "",
};

export const CaptionForm = memo(({ handleAddCaption, videoDuration, handlePauseVideo }: IProps) => {
  // states
  const [videoCaption, setVideoCaption] = useState<VideoCaption>(INIT_STATE);

  // hooks
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // methods
  function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!videoCaption.caption.trim() || !videoCaption.timestamp.trim()) {
      toast.error("Caption details can't be empty");
      return;
    }

    if (!isValidTimestamp(videoCaption.timestamp)) {
      toast.error("Invalid timestamp. Must be in the format hh:mm:ss with all the inputs filled.");
      return;
    }

    handleAddCaption(videoCaption);
    setVideoCaption(INIT_STATE);
  }

  function handleGetTimestamp(duration: number) {
    const timestamp = getTimestamp(duration);
    setVideoCaption((prev) => ({ ...prev, timestamp }));
  }

  // effects
  useEffect(() => {
    if (videoDuration === null) return;
    textAreaRef.current?.focus();
    handleGetTimestamp(videoDuration);
  }, [videoDuration]);

  console.log({ videoCaption, videoDuration });

  return (
    <form onSubmit={handleOnSubmit} className="border rounded-md p-3 bg-white h-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="timestamp" className="text-sm">
              Timestamp*
            </label>
            <InputMask
              id="timestamp"
              name="timestamp"
              className="border py-1 px-2 rounded-md w-[6rem]"
              mask="hh:mm:ss"
              placeholder="hh:mm:ss"
              separate
              replacement={{ h: /\d/, m: /\d/, s: /\d/ }}
              required
              disabled={videoDuration === null}
              value={videoCaption.timestamp}
              onChange={(e) => setVideoCaption((prev) => ({ ...prev, timestamp: e.target.value }))}
            />
          </div>

          {videoDuration ? (
            <Button
              disabled={!videoCaption.caption.trim() || !videoCaption.timestamp.trim()}
              type="submit"
              variant="default"
            >
              <Save size={18} />
              Save Caption
            </Button>
          ) : (
            <Button type="button" variant="default" onClick={handlePauseVideo}>
              <Plus size={18} />
              Add Caption Here
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="caption">Caption*</label>
          <textarea
            data-slot="textarea"
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none h-[10rem]"
            ref={textAreaRef}
            id="caption"
            placeholder="Caption here..."
            required
            disabled={videoDuration === null}
            value={videoCaption.caption}
            onChange={(e) => setVideoCaption((prev) => ({ ...prev, caption: e.target.value }))}
          />
        </div>
      </div>
    </form>
  );
});
