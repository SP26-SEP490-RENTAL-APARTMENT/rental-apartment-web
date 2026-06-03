import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface ImageCarouselProps {
  photos: string[];
}

function ImageCarousel({ photos }: ImageCarouselProps) {
  const [selectedMedia, setSelectedMedia] = useState<string>();

  useEffect(() => {
    if (photos.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMedia(photos[0]);
    }
  }, [photos]);

  const isVideo = (url: string) =>
    url.includes("/video/upload/") || /\.(mp4|mov|avi|mkv|webm)$/i.test(url);

  const currentMedia = selectedMedia || photos[0];
  const currentIndex = photos.indexOf(currentMedia);

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <div className="relative w-full h-125 bg-black rounded-2xl overflow-hidden shadow-lg">
        {currentMedia ? (
          isVideo(currentMedia) ? (
            <video
              src={currentMedia}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={currentMedia}
              alt="Apartment"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            No Media
          </div>
        )}

        {/* Badge Video */}
        {currentMedia && isVideo(currentMedia) && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            VIDEO
          </div>
        )}

        {/* Counter */}
        {photos.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="relative px-10">
        <Carousel
          opts={{
            align: "start",
            loop: photos.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {photos.map((media, index) => (
              <CarouselItem
                key={index}
                className="pl-2 basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <div
                  onClick={() => setSelectedMedia(media)}
                  className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    currentMedia === media
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {isVideo(media) ? (
                    <>
                      <video
                        src={media}
                        muted
                        className="w-full h-24 object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black text-lg">
                          ▶
                        </div>
                      </div>

                      <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                        VIDEO
                      </div>
                    </>
                  ) : (
                    <img
                      src={media}
                      alt={`Apartment ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {photos.length > 3 && (
            <>
              <CarouselPrevious className="-left-2" />
              <CarouselNext className="-right-2" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default ImageCarousel;
