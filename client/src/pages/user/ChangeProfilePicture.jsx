import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountForm from "../../components/user/AccountForm";
import ImageCropper from "../../components/common/ImageCropper";
import ImageDropZone from "../../components/common/ImageDropZone";

import getCroppedImage from "../../utils/getCroppedImage";

import { AuthContext } from "../../contexts/AuthContext";

import { updateProfilePicture } from "../../services/user.service";

export default function ChangeProfilePicture() {
  const navigate = useNavigate();

  const { user, getMe } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(user?.image?.url || null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSelect = (selectedFile) => {
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    setFile(selectedFile);

    setImage(URL.createObjectURL(selectedFile));

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("Please select an image.");
    }

    try {
      setLoading(true);

      const blob = await getCroppedImage(image, croppedAreaPixels);

      const formData = new FormData();

      formData.append("image", blob, "profile.webp");

      await updateProfilePicture(formData);

      await getMe();
      await getMe();

      console.log(user);

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <AccountForm
      title="Change Profile Picture"
      description="Upload and crop your new profile picture."
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    >
      <div className="space-y-8">
        <ImageCropper
          currentImage={user?.image?.url}
          image={file ? image : null}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={setCroppedAreaPixels}
        />

        <ImageDropZone preview={file ? image : null} onSelect={handleSelect} />
      </div>
    </AccountForm>
  );
}
