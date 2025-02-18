import { FC, useRef, useState } from "react";
import MainImageArea from "./MainImageArea";
import Sidebar from "./Sidebar";
import { PixelCrop } from "react-image-crop";
import { useDebounceEffect } from "../../utils/useDebounceEffect";
import { canvasPreview } from "../../utils/canvasPreview";

type Props = {
  imgSrc: string;
  clearImgSrc: () => void;
};
const ImageCropScreen: FC<Props> = ({ imgSrc, clearImgSrc }) => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef?.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row w-[100%] h-screen">
        <MainImageArea
          scale={scale}
          rotate={rotate}
          imgSrc={imgSrc}
          imgRef={imgRef}
          updateCompletedCrop={(c) => setCompletedCrop(c)}
        />
        <Sidebar
          scale={scale}
          rotate={rotate}
          imgRef={imgRef}
          previewCanvasRef={previewCanvasRef}
          completedCrop={completedCrop}
          updateScale={(v) => setScale(v)}
          updateRotate={(v) => setRotate(v)}
          clearImgSrc={clearImgSrc}
        />
      </div>
      {!!completedCrop && (
        <canvas
          className="hidden"
          ref={previewCanvasRef}
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: completedCrop.width,
            height: completedCrop.height,
          }}
        />
      )}
    </>
  );
};

export default ImageCropScreen;
