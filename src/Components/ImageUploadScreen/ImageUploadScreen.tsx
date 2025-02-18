import { FC } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  saveImage: (file: string) => void;
};

const ImageUploadScreen: FC<Props> = ({ saveImage }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (files: File[]) => {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        saveImage(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h1 className="font-bold text-2xl md:text-4xl">Crop IMAGE</h1>
      <p className="mb-10 mt-2 text-sm md:text-base text-gray-500">
        Crop JPG or PNG image
      </p>
      <div className="card">
        {/*begin::Dropzone*/}
        <div
          {...getRootProps({
            className: "dropzone",
          })}
        >
          <input {...getInputProps()} />
          <div className="dz-message cursor-pointer needsclick text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium md:font-bold rounded-lg px-6 py-4 md:px-15 md:py-8 me-2 mb-2 text-sm sm:text-lg ">
            <h5 className="fw-bold mb-0">
              Drop image here or click to upload.
            </h5>
          </div>
        </div>
        {/*end::Dropzone*/}
      </div>
    </div>
  );
};

export default ImageUploadScreen;
