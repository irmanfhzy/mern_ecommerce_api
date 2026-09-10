import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import AddressForm from "../../components/common/AddressForm";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import useIndonesiaRegion from "../../hooks/useIndonesiaRegion";

import { getProfile, updateAddress } from "../../services/user.service";

export default function EditAddress() {
  const navigate = useNavigate();
  const { addressId } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const {
    form,
    initializeRegion,
    provinces,
    cities,
    districts,
    villages,
    onChange,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onVillageChange,
  } = useIndonesiaRegion();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingPage(true);

        const res = await getProfile();

        const address = res.data.data.addresses.find(
          (item) => item._id === addressId,
        );

        if (!address) {
          throw new Error("Address not found.");
        }

        await initializeRegion(address);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUser();
  }, [addressId, initializeRegion]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingButton(true);

      await updateAddress(addressId, form);

      navigate(-1);
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
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Address</h1>

        <p className="mt-2 text-gray-500">Edit your shipping address.</p>
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
          onChange={onChange}
          onProvinceChange={onProvinceChange}
          onCityChange={onCityChange}
          onDistrictChange={onDistrictChange}
          onVillageChange={onVillageChange}
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
