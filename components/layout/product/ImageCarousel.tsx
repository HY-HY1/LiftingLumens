import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ImageDialogContent } from "./ImageDialog";

interface ImageCarouselProps {
  arr: string[];
}

export function ImageCarousel({ arr }: ImageCarouselProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined); // State to track the selected image for the dialog

  const handleImageClick = (imgUrl: string) => {
    setSelectedImage(imgUrl); // Set the selected image when clicked
  };

  return (
    <>
      {/* Dialog is rendered once */}
      <Dialog open={selectedImage !== undefined} onOpenChange={(open) => !open && setSelectedImage(undefined)}>
        <ImageDialogContent img={selectedImage} />


      {/* Carousel Component */}
      <Carousel className="w-full border-none  ">
        <CarouselContent>
          {arr.map((imgUrl, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    {/* Trigger Dialog on Image Click */}
                    <DialogTrigger asChild>
                      <img
                        src={imgUrl}
                        alt={`Image ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(imgUrl)} // Set the clicked image in state
                      />
                    </DialogTrigger>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </Dialog>
    </>
  );
}
