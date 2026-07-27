import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/admin/ProductForm";

import PATHS from "../../constants/paths";

import { addProduct } from "../../services/product.service";

export default function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    images: [],
    variants: [
      {
        attributes: [
          {
            key: "",
            value: "",
          },
        ],
        sku: "",
        stock: 0,
        costPrice: 0,
        sellingPrice: 0,
        images: [],
      },
    ],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm((prev) => {
      const variants = [...prev.variants];

      variants[index] = {
        ...variants[index],
        [field]: value,
      };

      return {
        ...prev,
        variants,
      };
    });
  };

  const handleAttributeChange = (
    variantIndex,
    attributeIndex,
    field,
    value,
  ) => {
    setForm((prev) => {
      const variants = [...prev.variants];

      const attributes = [...variants[variantIndex].attributes];

      attributes[attributeIndex] = {
        ...attributes[attributeIndex],
        [field]: value,
      };

      variants[variantIndex].attributes = attributes;

      return {
        ...prev,
        variants,
      };
    });
  };

  const handleAddAttribute = (variantIndex) => {
    setForm((prev) => {
      const variants = [...prev.variants];

      variants[variantIndex].attributes.push({
        key: "",
        value: "",
      });

      return {
        ...prev,
        variants,
      };
    });
  };

  const handleRemoveAttribute = (variantIndex, attributeIndex) => {
    setForm((prev) => {
      const variants = [...prev.variants];

      variants[variantIndex].attributes.splice(attributeIndex, 1);

      return {
        ...prev,
        variants,
      };
    });
  };

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          attributes: [
            {
              key: "",
              value: "",
            },
          ],
          sku: "",
          stock: 0,
          costPrice: 0,
          sellingPrice: 0,
          images: [],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    if (form.variants.length === 1) return;

    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantImageChange = (variantIndex, files) => {
    setForm((prev) => {
      const variants = [...prev.variants];

      variants[variantIndex] = {
        ...variants[variantIndex],
        images: files,
      };

      return {
        ...prev,
        variants,
      };
    });
  };

  const handleProductImageChange = (files) => {
    setForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("description", form.description);

      form.images.forEach((image) => {
        formData.append("productImages", image);
      });

      formData.append("variants", JSON.stringify(form.variants));

      form.variants.forEach((variant, index) => {
        variant.images.forEach((image) => {
          formData.append(`variantImages${index}`, image);
        });
      });

      await addProduct(formData);

      navigate(PATHS.ADMIN.PRODUCTS);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      form={form}
      loading={loading}
      onChange={handleChange}
      onProductImageChange={handleProductImageChange}
      onVariantImageChange={handleVariantImageChange}
      onVariantChange={handleVariantChange}
      onAttributeChange={handleAttributeChange}
      onAddAttribute={handleAddAttribute}
      onRemoveAttribute={handleRemoveAttribute}
      onAddVariant={handleAddVariant}
      onRemoveVariant={handleRemoveVariant}
      onSubmit={handleSubmit}
    />
  );
}
