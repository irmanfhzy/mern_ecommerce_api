import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import VariantInfoForm from "../../components/admin/VariantInfoForm";
import AttributeInput from "../../components/admin/AttributeInput";
import Loading from "../../components/common/Loading";

import PATHS from "../../constants/paths";

import {
  getVariantById,
  updateVariantById,
} from "../../services/variant.service";

export default function EditVariant() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const [deletedImages, setDeletedImages] = useState([]);

  const [form, setForm] = useState({
    sku: "",
    stock: 0,
    costPrice: 0,
    sellingPrice: 0,
    images: [],
    attributes: [],
  });

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setLoadingPage(true);
        const res = await getVariantById(variantId);
        const variant = res.data.data;

        setForm({
          sku: variant.sku,
          stock: variant.stock,
          costPrice: variant.costPrice,
          sellingPrice: variant.sellingPrice,
          images: variant.images,
          attributes: variant.attributes,
        });
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchVariant();
  }, [variantId]);

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

  const handleAttributeChange = (attributeIndex, field, value) => {
    setForm((prev) => {
      const attributes = [...prev.attributes];

      attributes[attributeIndex] = {
        ...attributes[attributeIndex],
        [field]: value,
      };

      return {
        ...prev,
        attributes,
      };
    });
  };

  const handleAddAttribute = () => {
    setForm((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          key: "",
          value: "",
        },
      ],
    }));
  };

  const handleRemoveAttribute = (attributeIndex) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (_, index) => index !== attributeIndex,
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoadingButton(true);

      const formData = new FormData();

      formData.append("sku", form.sku);
      formData.append("stock", form.stock);
      formData.append("costPrice", form.costPrice);
      formData.append("sellingPrice", form.sellingPrice);

      formData.append("attributes", JSON.stringify(form.attributes));

      if (deletedImages.length) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      form.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("variantImages", image);
        }
      });

      await updateVariantById(variantId, formData);

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
      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-bold">Variant Information</h2>

        <VariantInfoForm
          variant={form}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          showStock={false}
        />

        <div className="mt-6">
          <AttributeInput
            variantIndex={0}
            attributes={form.attributes}
            onChange={(_, attributeIndex, field, value) =>
              handleAttributeChange(attributeIndex, field, value)
            }
            onAdd={() => handleAddAttribute()}
            onRemove={(_, attributeIndex) =>
              handleRemoveAttribute(attributeIndex)
            }
          />
        </div>
      </div>

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
