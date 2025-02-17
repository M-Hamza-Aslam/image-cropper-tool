import { FC, useState } from "react";
import MainImageArea from "./MainImageArea";
import Sidebar from "./Sidebar";

type Props = {
  imgSrc: string;
  clearImgSrc: () => void;
};
const ImageCropScreen: FC<Props> = ({ imgSrc, clearImgSrc }) => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  return (
    <div className="flex w-[100%] h-[100%]">
      <MainImageArea scale={scale} rotate={rotate} imgSrc={imgSrc} />
      <Sidebar
        scale={scale}
        rotate={rotate}
        updateScale={(v) => setScale(v)}
        updateRotate={(v) => setRotate(v)}
        clearImgSrc={clearImgSrc}
      />
    </div>
  );
};

export default ImageCropScreen;
