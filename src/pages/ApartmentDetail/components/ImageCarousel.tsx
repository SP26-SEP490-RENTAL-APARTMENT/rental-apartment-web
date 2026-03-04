import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [isSelected, setIsSelected] = useState(images[0]);
  const currentIndex = images.indexOf(isSelected);

  return (
    <div className="space-y-4">
      <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
        <img
          src={isSelected}
          alt="Selected"
          className="w-full h-96 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="relative px-8">
        <Carousel opts={{ align: "center", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem
                
                className="pl-2 sm:basis-1 md:basis-1/2 lg:basis-1/3"
              >
                <div
                key={index}
                  onClick={() => setIsSelected(image)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                    isSelected === image
                      ? "border-gray-500"
                      : "hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Apartment ${index + 1}`}
                    className="w-full h-40 object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
                
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
}

export default ImageCarousel;
