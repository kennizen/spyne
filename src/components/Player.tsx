import { VideoMetadata } from "@/api/queries";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaptionForm } from "./CaptionForm";
import { getTimestamp } from "@/utils/helpers";
import { VideoForm } from "./VideoForm";
import { CaptionMap } from "./CaptionMap";

export type VideoData = {
  duration: number;
  url: string;
} & VideoMetadata;

export type VideoCaption = {
  timestamp: string;
  caption: string;
};

export type VideoCaptions = Record<string, VideoCaption>;

const INIT_STATE: VideoData = {
  contentType: "N/A",
  duration: 0,
  contentLength: 0,
  size: "N/A",
  url: "",
};

export const Player = () => {
  // states
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoCurDuration, setVideoCurDuration] = useState<null | number>(null);
  const [videoCaptions, setVideoCaptions] = useState<VideoCaptions>({});
  const [curLiveCaption, setCurLiveCap] = useState("");

  // hooks
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // methods
  const handleSetVideoData = useCallback((data: VideoData | null) => {
    setVideoData(data);
  }, []);

  const handleAddVideoCaption = useCallback((data: VideoCaption) => {
    setVideoCaptions((prev) => ({ ...prev, [data.timestamp]: data }));
    setVideoCurDuration(null);
    videoRef.current?.play();
  }, []);

  const handlePauseVideo = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setVideoCurDuration(videoRef.current.currentTime);
  }, []);

  const handleDeleteCaption = useCallback(
    (id: string) => {
      if (!videoRef.current) return;

      videoRef.current.pause();
      const captions = structuredClone(videoCaptions);
      delete captions[id];

      setVideoCaptions(captions);
      setCurLiveCap("");
    },
    [videoCaptions]
  );

  function handleCheckToShowCaptions() {
    if (!videoRef.current) return;
    const curTime = videoRef.current.currentTime;
    const timestamp = getTimestamp(curTime);
    if (videoCaptions[timestamp]) setCurLiveCap(videoCaptions[timestamp].caption);
  }

  // effects
  useEffect(() => {
    if (!videoData) return;
    videoRef.current?.play();
  }, [videoData]);

  useEffect(() => {
    if (!videoRef.current || !videoData) return;
    videoRef.current.ontimeupdate = handleCheckToShowCaptions;
  }, [videoData, videoCaptions]);

  return (
    <section className="container mx-auto grid grid-cols-12 py-4 h-full gap-4">
      <div className="bg-zinc-100 flex-1 min-h-[20rem] h-full overflow-auto rounded-md col-span-12 lg:col-span-3 p-3">
        <CaptionMap captions={videoCaptions} handleDeleteCaption={handleDeleteCaption} />
      </div>

      <div className="flex-1 rounded-md col-span-12 lg:col-span-9 bg-zinc-100 p-4">
        <div className="w-full h-[35rem] bg-white flex flex-col items-center justify-center mb-4 rounded-md relative">
          {videoData && (
            <>
              <video ref={videoRef} controls className="h-full">
                <source src={videoData.url} type={videoData.contentType} />
              </video>
              {curLiveCaption ? (
                <div className="absolute bottom-[10%] bg-black/50 text-white py-1 px-2 flex items-center justify-center">
                  {curLiveCaption}
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-36rem)]">
          <CaptionForm
            handlePauseVideo={handlePauseVideo}
            videoDuration={videoCurDuration}
            handleAddCaption={handleAddVideoCaption}
          />
          <VideoForm handleSetVideoData={handleSetVideoData} videoData={videoData ?? INIT_STATE} />
        </div>
      </div>
    </section>
  );
};
