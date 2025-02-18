import { FC, RefObject, useRef, useState } from "react";
import { PixelCrop } from "react-image-crop";
import { X, Menu } from "lucide-react"; // Import icons

type Props = {
  scale: number;
  rotate: number;
  imgRef: RefObject<HTMLImageElement | null>;
  previewCanvasRef: RefObject<HTMLCanvasElement | null>;
  completedCrop: PixelCrop | undefined;
  updateScale: (value: number) => void;
  updateRotate: (value: number) => void;
  clearImgSrc: () => void;
};

const Sidebar: FC<Props> = ({
  scale,
  rotate,
  imgRef,
  previewCanvasRef,
  completedCrop,
  updateScale,
  updateRotate,
  clearImgSrc,
}) => {
  const blobUrlRef = useRef("");
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    setIsDownloading(true);

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
    setIsDownloading(false);
  }
  return (
    <>
      {/* Menu Button (Only on Mobile) */}
      <div className="w-full lg:hidden text-end ">
        <button
          className=" p-4 text-gray-600 hover:text-black"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar (Large Screens - Visible, Small Screens - Off-Canvas on the Right) */}
      <aside
        className={`fixed lg:static top-0 right-0 h-screen w-[350px] z-20 bg-white border-l flex flex-col  justify-between 
          transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
      >
        <div>
          <div className="border-b p-8 text-center flex justify-between items-center">
            <span className="font-bold text-xl lg:text-2xl">Crop Options</span>
            {/* Close Button (Only on Mobile) */}
            <button
              className="lg:hidden text-gray-600 hover:text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="border-b p-8 flex justify-between items-center">
            <p className="font-semibold">Scale</p>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              onChange={(e) => updateScale(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[120px] p-2.5"
            />
          </div>
          <div className="border-b p-8 flex justify-between items-center">
            <p className="font-semibold">Rotate</p>
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
            />
          </div>
        </div>
        <div className="mx-4">
          <button
            onClick={onDownloadCropClick}
            disabled={isDownloading}
            className="w-full flex gap-2 items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
            disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Download Cropped Image
            {isDownloading && (
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
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
      </aside>

      {/* Overlay for Off-Canvas Sidebar (Mobile Only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500 z-10 opacity-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
