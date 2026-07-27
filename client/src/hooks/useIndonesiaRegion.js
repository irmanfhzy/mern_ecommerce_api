import { useEffect, useState } from "react";

import {
  getProvinces,
  getCities,
  getDistricts,
  getVillages,
} from "../services/region.service";

const createInitialForm = (initialData = {}) => ({
  label: "",
  recipientName: "",
  phone: "",
  street: "",
  postalCode: "",

  provinceId: "",
  province: "",

  cityId: "",
  city: "",

  districtId: "",
  district: "",

  villageId: "",
  village: "",

  isDefault: false,

  ...initialData,
});

export default function useIndonesiaRegion(initialData = {}) {
  const [form, setForm] = useState(createInitialForm(initialData));

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      setProvinces(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const initializeRegion = async (address) => {
    const [citiesRes, districtsRes, villagesRes] = await Promise.all([
      getCities(address.provinceId),
      getDistricts(address.cityId),
      getVillages(address.districtId),
    ]);

    setCities(citiesRes.data);
    setDistricts(districtsRes.data);
    setVillages(villagesRes.data);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;

    const selectedProvince = provinces.find(
      (province) => province.id === provinceId,
    );

    setForm((prev) => ({
      ...prev,

      provinceId: selectedProvince?.id ?? "",
      province: selectedProvince?.name ?? "",

      cityId: "",
      city: "",

      districtId: "",
      district: "",

      villageId: "",
      village: "",
    }));

    setCities([]);
    setDistricts([]);
    setVillages([]);

    if (!selectedProvince) return;

    try {
      const res = await getCities(selectedProvince.id);
      setCities(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;

    const selectedCity = cities.find((city) => city.id === cityId);

    setForm((prev) => ({
      ...prev,

      cityId: selectedCity?.id ?? "",
      city: selectedCity?.name ?? "",

      districtId: "",
      district: "",

      villageId: "",
      village: "",
    }));

    setDistricts([]);
    setVillages([]);

    if (!selectedCity) return;

    try {
      const res = await getDistricts(selectedCity.id);
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;

    const selectedDistrict = districts.find(
      (district) => district.id === districtId,
    );

    setForm((prev) => ({
      ...prev,

      districtId: selectedDistrict?.id ?? "",
      district: selectedDistrict?.name ?? "",

      villageId: "",
      village: "",
    }));

    setVillages([]);

    if (!selectedDistrict) return;

    try {
      const res = await getVillages(selectedDistrict.id);
      setVillages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVillageChange = (e) => {
    const villageId = e.target.value;

    const selectedVillage = villages.find(
      (village) => village.id === villageId,
    );

    setForm((prev) => ({
      ...prev,

      villageId: selectedVillage?.id ?? "",
      village: selectedVillage?.name ?? "",
    }));
  };

  const resetForm = () => {
    setForm(createInitialForm());

    setCities([]);
    setDistricts([]);
    setVillages([]);
  };

  return {
    form,
    setForm,
    resetForm,

    initializeRegion,
    provinces,
    cities,
    districts,
    villages,

    handleChange,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange,
  };
}
