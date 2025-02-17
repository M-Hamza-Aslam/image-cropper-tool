import { FC } from "react";

type Props = {
  scale: number;
  updateScale: (value: number) => void;
  rotate: number;
  updateRotate: (value: number) => void;
  clearImgSrc: () => void;
};

const Sidebar: FC<Props> = ({
  scale,
  updateScale,
  rotate,
  updateRotate,
  clearImgSrc,
}) => {
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
        <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
          Download Cropped Image
        </button>
        <button
          onClick={clearImgSrc}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
