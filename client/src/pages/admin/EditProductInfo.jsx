import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import ProductInfoForm from "../../components/admin/ProductInfoForm";
import Loading from "../../components/common/Loading";

import PATHS from "../../constants/paths";

import {
  getProductById,
  updateProductById,
} from "../../services/product.service";

export default function EditProductInfo() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const [deletedImages, setDeletedImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingPage(true);
        const res = await getProductById(productId);
        const product = res.data.items;

        setForm({
          name: product.name,
          brand: product.brand,
          description: product.description,
          images: product.images,
          isActive: product.isActive,
        });
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (files) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (image) => {
    if (!(image instanceof File)) {
      setDeletedImages((prev) => [...prev, image.publicId]);
    }

    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoadingButton(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("description", form.description);
      formData.append("isActive", form.isActive);

      if (deletedImages.length) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      form.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("productImages", image);
        }
      });

      await updateProductById(productId, formData);

      navigate(PATHS.ADMIN.PRODUCTS_READ(productId));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  if (loadingPage) {
    return <Loading fullScreen={true} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ProductInfoForm
        form={form}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
      />

      <div className="flex justify-end">
        <Button
          variant="primary"
          type="button"
          loading={loadingButton}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
