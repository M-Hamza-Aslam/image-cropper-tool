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
    <div>
      <h1>Crop Image</h1>
      <p>Crop JPG or PNG image</p>
      <div className="card">
        {/*begin::Dropzone*/}
        <div
          {...getRootProps({
            className: "dropzone",
          })}
        >
          <input {...getInputProps()} />
          <div className="dz-message cursor-pointer needsclick text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
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
