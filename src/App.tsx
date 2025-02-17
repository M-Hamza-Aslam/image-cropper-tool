import { useState } from "react";

import "react-image-crop/dist/ReactCrop.css";
import ImageUploadScreen from "./Components/ImageUploadScreen/ImageUploadScreen";
import ImageCropScreen from "./Components/ImageCropScreen/ImageCropScreen";

export default function App() {
  const [imgSrc, setImgSrc] = useState("");
  return (
    <div className="App">
      {/* upload file with dropzone */}
      {!imgSrc && (
        <ImageUploadScreen
          saveImage={(imageString) => setImgSrc(imageString)}
        />
      )}

      {/* upload file with dropzone */}

      {!!imgSrc && (
        <ImageCropScreen imgSrc={imgSrc} clearImgSrc={() => setImgSrc("")} />
      )}
    </div>
  );
}
