import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddressForm from "../../components/user/AddressForm";

import useIndonesiaRegion from "../../hooks/useIndonesiaRegion";

import { addAddress } from "../../services/user.service";

export default function AddAddress() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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
      setLoading(true);

      await addAddress(form);

      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Address</h1>

        <p className="mt-2 text-gray-500">Add a new shipping address.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <AddressForm
          form={form}
          loading={loading}
          provinces={provinces}
          cities={cities}
          districts={districts}
          villages={villages}
          onChange={handleChange}
          onProvinceChange={handleProvinceChange}
          onCityChange={handleCityChange}
          onDistrictChange={handleDistrictChange}
          onVillageChange={handleVillageChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
