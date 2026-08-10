import { useContext, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProductInfo from "../../components/admin/ProductInfo";
import VariantTable from "../../components/admin/VariantTable";
import Loading from "../../components/common/Loading";

import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import { getProductById } from "../../services/product.service";
import { deleteVariantById } from "../../services/variant.service";

import PATHS from "../../constants/paths";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const loadProduct = useCallback(async () => {
    const res = await getProductById(productId);
    return res.data.items;
  }, [productId]);

  const handleDeleteVariaant = (variant) => {
    openDialog({
      title: "Delete Variant",
      message: "Are you sure you want to delete this variant?",
      confirmVariant: "danger",
      cancelVariant: "ghost",
      confirmText: "Delete",
      cancelText: "Cancel",
      disabled: loadingButton,
      onConfirm: async () => {
        try {
          setLoadingButton(true);
          await deleteVariantById(variant._id);
          const updatedProduct = await loadProduct();
          setProduct(updatedProduct);
          closeDialog();
        } catch (error) {
          alert(error.response?.data?.message || error.message);
        } finally {
          setLoadingButton(false);
          closeDialog();
        }
      },
    });
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoadingPage(true);
        const product = await loadProduct();
        setProduct(product);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoadingPage(false);
      }
    }

    fetchProduct();
  }, [loadProduct]);

  if (loadingPage) {
    return <Loading fullScreen={true} />;
  }

  return (
    <div className="space-y-8">
      <ProductInfo
        product={product}
        onEdit={() => navigate(PATHS.ADMIN.PRODUCTS_EDIT(productId))}
      />

      <VariantTable
        variants={product.variants}
        onEdit={(variant) =>
          navigate(PATHS.ADMIN.PRODUCTS_VARIANTS_EDIT(productId, variant._id))
        }
        onDelete={(variant) => handleDeleteVariaant(variant)}
        onRestock={(variant) =>
          navigate(
            PATHS.ADMIN.PRODUCTS_VARIANTS_RESTOCK(productId, variant._id),
          )
        }
        onAddVariant={() =>
          navigate(PATHS.ADMIN.PRODUCTS_VARIANTS_CREATE(productId))
        }
        cellClassName="p-4"
      />
    </div>
  );
}
