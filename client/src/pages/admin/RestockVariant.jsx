import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";

import PATHS from "../../constants/paths";

import {
  INVENTORY_REASON,
  INVENTORY_TYPE,
} from "@ecommerce/shared/constants/index.js";

import {
  getVariantById,
  updateVariantStock,
} from "../../services/variant.service";

export default function RestockVariant() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const [variant, setVariant] = useState(null);

  const [form, setForm] = useState({
    quantity: "",
    type: INVENTORY_TYPE.IN,
    reason: INVENTORY_REASON.RESTOCK,
  });

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setLoadingPage(true);

        const res = await getVariantById(variantId);

        setVariant(res.data.data);
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

  const handleSubmit = async () => {
    try {
      setLoadingButton(true);

      await updateVariantStock(variantId, form);

      navigate(PATHS.ADMIN.PRODUCTS_READ(productId));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  if (loadingPage) {
    return <Loading fullScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-bold">Update Stock</h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-medium">Current Stock</label>

            <input
              type="text"
              value={variant.stock}
              disabled
              className="w-full rounded border bg-gray-100 px-3 py-2"
            />

            <p className="mt-1 text-sm text-gray-500">
              Current quantity available in inventory.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">Quantity</label>

            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full rounded border px-3 py-2"
            />

            <p className="mt-1 text-sm text-gray-500">
              Enter the number of items to add or remove.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">Type</label>

            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value={INVENTORY_TYPE.IN}>Stock In</option>
              <option value={INVENTORY_TYPE.OUT}>Stock Out</option>
            </select>

            <p className="mt-1 text-sm text-gray-500">
              <strong>Stock In</strong> adds inventory, while{" "}
              <strong>Stock Out</strong> removes inventory.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">Reason</label>

            <select
              value={form.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value={INVENTORY_REASON.RESTOCK}>Restock</option>

              <option value={INVENTORY_REASON.ADJUSTMENT}>
                Stock Adjustment
              </option>

              <option value={INVENTORY_REASON.DAMAGED}>Damaged</option>

              <option value={INVENTORY_REASON.LOST}>Lost</option>

              <option value={INVENTORY_REASON.RETURN}>Return</option>
            </select>

            <p className="mt-1 text-sm text-gray-500">
              Select the reason for this stock movement. This information will
              be recorded in the inventory history for future reference.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            variant="primary"
            loading={loadingButton}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
