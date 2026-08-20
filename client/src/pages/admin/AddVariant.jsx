import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import VariantForm from "../../components/admin/VariantForm";

import { addVariant } from "../../services/variant.service";

export default function AddVariant() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [variant, setVariant] = useState({
    sku: "",
    stock: "",
    costPrice: "",
    sellingPrice: "",
    attributes: [{ key: "", value: "" }],
    images: [],
  });

  const handleChange = (index, field, value) => {
    setVariant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (index, files) => {
    setVariant((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index, image) => {
    setVariant((prev) => ({
      ...prev,
      images: prev.images.filter((item) => item !== image),
    }));
  };

  const handleAttributeChange = (
    variantIndex,
    attributeIndex,
    field,
    value,
  ) => {
    setVariant((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attribute, index) =>
        index === attributeIndex
          ? {
              ...attribute,
              [field]: value,
            }
          : attribute,
      ),
    }));
  };

  const handleAddAttribute = () => {
    setVariant((prev) => ({
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

  const handleRemoveAttribute = (variantIndex, attributeIndex) => {
    setVariant((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (_, index) => index !== attributeIndex,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productId", productId);
      formData.append("sku", variant.sku);
      formData.append("stock", variant.stock);
      formData.append("costPrice", variant.costPrice);
      formData.append("sellingPrice", variant.sellingPrice);
      formData.append("attributes", JSON.stringify(variant.attributes));

      variant.images.forEach((image) => {
        formData.append("variantImages", image);
      });

      await addVariant(productId, formData);

      alert("Variant created successfully.");

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Add Variant</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <VariantForm
          index={0}
          variant={variant}
          removable={false}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onAttributeChange={handleAttributeChange}
          onAddAttribute={handleAddAttribute}
          onRemoveAttribute={handleRemoveAttribute}
          onRemoveVariant={() => {}}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button type="submit" variant="primary" loading={loading}>
            {loading ? "Saving..." : "Create Variant"}
          </Button>
        </div>
      </form>
    </div>
  );
}
