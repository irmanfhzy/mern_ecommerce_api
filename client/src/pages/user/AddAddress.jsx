import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddressForm from "../../components/common/AddressForm";
import Button from "../../components/common/Button";

import useIndonesiaRegion from "../../hooks/useIndonesiaRegion";

import { addAddress } from "../../services/user.service";

export default function AddAddress() {
  const navigate = useNavigate();

  const [loadingButton, setLoadingButton] = useState(false);

  const {
    form,
    provinces,
    cities,
    districts,
    villages,

    handleChange,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange,
  } = useIndonesiaRegion();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingButton(true);

      await addAddress(form);

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Address</h1>

        <p className="mt-2 text-gray-500">Add a new shipping address.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <AddressForm
          form={form}
          provinces={provinces}
          cities={cities}
          districts={districts}
          villages={villages}
          onChange={handleChange}
          onProvinceChange={handleProvinceChange}
          onCityChange={handleCityChange}
          onDistrictChange={handleDistrictChange}
          onVillageChange={handleVillageChange}
        />

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button type="submit" variant="primary" loading={loadingButton}>
            Save Address
          </Button>
        </div>
      </form>
    </div>
  );
}
