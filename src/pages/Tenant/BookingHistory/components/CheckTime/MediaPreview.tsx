export default function MediaPreview({ url }: { url?: string }) {
  if (!url) return null;

  const isVideoFile = (url?: string) => {
    if (!url) return false;

    return (
      url.includes("/video/upload/") ||
      /\.(mp4|mov|avi|mkv|webm)$/i.test(url.split("?")[0])
    );
  };
  const isVideo = isVideoFile(url);

  return isVideo ? (
    <video src={url} controls className="rounded-xl h-72 w-full object-cover" />
  ) : (
    <img
      src={url}
      alt="Evidence"
      className="rounded-xl h-72 w-full object-cover"
    />
  );
}
