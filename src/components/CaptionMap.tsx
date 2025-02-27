import { memo } from "react";
import { VideoCaptions } from "./Player";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface IProps {
  captions: VideoCaptions;
  handleDeleteCaption: (id: string) => void;
}

export const CaptionMap = memo(({ captions, handleDeleteCaption }: IProps) => {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(captions).map((cap) => (
        <div key={cap.timestamp} className="rounded-md shadow bg-white p-2 flex flex-col text-sm">
          <Button className="ml-auto w-6 h-6 rounded-sm" onClick={() => handleDeleteCaption(cap.timestamp)}>
            <Trash2 size={14}/>
          </Button>
          <p>{cap.caption}</p>
          <span className="ml-auto text-xs">{cap.timestamp}</span>
        </div>
      ))}
    </div>
  );
});
