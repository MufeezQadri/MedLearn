import { PlayCircle, ScrollText } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/card";
import { mockApp } from "../data/mock-app";

export const VideoPlayerPage = () => {
  const { id = "" } = useParams();
  const video = mockApp.getVideo(id);

  if (!video) {
    return <Card>Video not found.</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[2rem] p-0">
        <div className="flex min-h-[360px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(183,234,255,0.4),_transparent_30%),linear-gradient(180deg,_#0e3d4a_0%,_#0b1c30_100%)] text-white">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <PlayCircle className="h-10 w-10" />
            </div>
            <h2 className="font-headline text-3xl font-extrabold">{video.title}</h2>
            <p className="mt-2 text-primary-fixed">{video.description}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center gap-2 text-primary">
          <ScrollText className="h-5 w-5" />
          <h3 className="font-headline text-2xl font-extrabold">Transcript highlights</h3>
        </div>
        <p className="leading-8 text-on-surface-variant">{video.transcript}</p>
      </Card>
    </div>
  );
};
