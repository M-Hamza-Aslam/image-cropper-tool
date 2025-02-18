import { FC, RefObject, useRef } from "react";
import { PixelCrop } from "react-image-crop";

type Props = {
  scale: number;
  rotate: number;
  imgRef: RefObject<HTMLImageElement> | null;
  completedCrop: PixelCrop | undefined;
  updateScale: (value: number) => void;
  updateRotate: (value: number) => void;
  clearImgSrc: () => void;
};

const Sidebar: FC<Props> = ({
  scale,
  rotate,
  imgRef,
  completedCrop,
  updateScale,
  updateRotate,
  clearImgSrc,
}) => {
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);

  async function onDownloadCropClick() {
    const image = imgRef?.current;
    if (!image || !completedCrop) {
      throw new Error("Crop data does not exist");
    }

    // Scale factors based on the original image size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Create an offscreen canvas
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, // Source X
      completedCrop.y * scaleY, // Source Y
      completedCrop.width * scaleX, // Source Width
      completedCrop.height * scaleY, // Source Height
      0, // Destination X
      0, // Destination Y
      offscreen.width, // Destination Width
      offscreen.height // Destination Height
    );

    // Convert canvas to blob
    const blob = await offscreen.convertToBlob({ type: "image/png" });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  }

  return (
    <div className="w-[20%] border-s bg-white flex flex-col justify-between">
      <div>
        <div className="border-b p-8 text-center">Crop Options</div>
        <div className="border-b p-8 flex justify-between items-center">
          <p>Scale</p>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            onChange={(e) => updateScale(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[120px] p-2.5 "
          ></input>
        </div>
        <div className="border-b p-8 flex justify-between items-center">
          <p>Rotate</p>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            onChange={(e) =>
              updateRotate(
                Math.min(180, Math.max(-180, Number(e.target.value)))
              )
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[120px] p-2.5"
          ></input>
        </div>
      </div>
      <div className="mx-4">
        <button
          onClick={onDownloadCropClick}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Download Cropped Image
        </button>
        <button
          onClick={clearImgSrc}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Back
        </button>
        <a
          href="#hidden"
          ref={hiddenAnchorRef}
          download
          style={{
            position: "absolute",
            top: "-200vh",
            visibility: "hidden",
          }}
        >
          Hidden download
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
