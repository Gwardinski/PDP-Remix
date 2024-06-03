import { H4 } from "./ui";

export type YoutubeVideo = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YoutubeVideoThumbnail;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: YoutubeVideoResourceId;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
};

export type YoutubeVideoThumbnail = {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium: {
    url: string;
    width: number;
    height: number;
  };
  high: {
    url: string;
    width: number;
    height: number;
  };
  standard: {
    url: string;
    width: number;
    height: number;
  };
  maxres: {
    url: string;
    width: number;
    height: number;
  };
};

export type YoutubeVideoResourceId = { kind: string; videoId: string };

export const YoutubeVideoGrid = ({ videos }: { videos: YoutubeVideo[] }) => {
  return (
    <div className="glass dark:dark-glass flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-md p-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:p-4 ">
      {videos
        .filter((v) => v.snippet?.title !== "Private video")
        .map((video) => (
          <YoutubeCard key={video.id} video={video} />
        ))}
    </div>
  );
};

export const YoutubeCard = ({ video }: { video: YoutubeVideo }) => {
  const { snippet } = video;
  const { title, thumbnails, resourceId } = snippet;
  const { medium, high } = thumbnails;
  const { videoId } = resourceId;
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      className="flex h-full w-full max-w-[480px] flex-col items-start justify-start gap-1 overflow-hidden rounded-md border border-transparent hover:underline sm:max-w-[320px]"
    >
      {medium && high && (
        <>
          <img
            className="hidden rounded-md lg:flex"
            src={medium.url}
            alt={"thumbnail"}
            height={medium.height}
            width={medium.width}
          />
          <img
            className="flex rounded-md lg:hidden"
            src={high.url}
            alt={"thumbnail"}
            height={high.height}
            width={high.width}
          />
        </>
      )}
      <H4 className="max-h-[98px] overflow-hidden overflow-ellipsis">
        {title}
      </H4>
    </a>
  );
};
