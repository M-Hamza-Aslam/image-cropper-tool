import { FC, useRef, useState } from "react";
import MainImageArea from "./MainImageArea";
import Sidebar from "./Sidebar";
import { PixelCrop } from "react-image-crop";

type Props = {
  imgSrc: string;
  clearImgSrc: () => void;
};
const ImageCropScreen: FC<Props> = ({ imgSrc, clearImgSrc }) => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  return (
    <div className="flex w-[100%] h-[100%]">
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
        completedCrop={completedCrop}
        updateScale={(v) => setScale(v)}
        updateRotate={(v) => setRotate(v)}
        clearImgSrc={clearImgSrc}
      />
    </div>
  );
};

export default ImageCropScreen;
