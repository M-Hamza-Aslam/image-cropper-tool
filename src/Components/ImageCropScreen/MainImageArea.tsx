import { FC, RefObject, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";

type Props = {
  imgSrc: string;
  scale: number;
  rotate: number;
  imgRef: RefObject<HTMLImageElement | null>;
  updateCompletedCrop: (c: PixelCrop) => void;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const MainImageArea: FC<Props> = ({
  imgSrc,
  scale,
  rotate,
  imgRef,
  updateCompletedCrop,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [aspect] = useState<number | undefined>(16 / 9);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => updateCompletedCrop(c)}
        aspect={aspect}
        minHeight={100}
      >
        <img
          ref={imgRef}
          alt="Crop me"
          src={imgSrc}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          onLoad={onImageLoad}
        />
      </ReactCrop>
    </div>
  );
};

export default MainImageArea;
