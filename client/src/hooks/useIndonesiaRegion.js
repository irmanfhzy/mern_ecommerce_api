import { useCallback, useEffect, useState } from "react";

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
  const [form, setForm] = useState(() => createInitialForm(initialData));

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState({
    provinces: false,
    cities: false,
    districts: false,
    villages: false,
  });

  const loadProvinces = useCallback(async () => {
    setLoading((prev) => ({
      ...prev,
      provinces: true,
    }));

    try {
      const data = await getProvinces();

      setProvinces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load provinces:", error);
      setProvinces([]);
    } finally {
      setLoading((prev) => ({
        ...prev,
        provinces: false,
      }));
    }
  }, []);

  const loadCities = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setCities([]);
      return [];
    }

    setLoading((prev) => ({
      ...prev,
      cities: true,
    }));

    try {
      const data = await getCities(provinceCode);

      const result = Array.isArray(data) ? data : [];

      setCities(result);

      return result;
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);

      return [];
    } finally {
      setLoading((prev) => ({
        ...prev,
        cities: false,
      }));
    }
  }, []);

  const loadDistricts = useCallback(async (regencyCode) => {
    if (!regencyCode) {
      setDistricts([]);
      return [];
    }

    setLoading((prev) => ({
      ...prev,
      districts: true,
    }));

    try {
      const data = await getDistricts(regencyCode);

      const result = Array.isArray(data) ? data : [];

      setDistricts(result);

      return result;
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDistricts([]);

      return [];
    } finally {
      setLoading((prev) => ({
        ...prev,
        districts: false,
      }));
    }
  }, []);

  const loadVillages = useCallback(async (districtCode) => {
    if (!districtCode) {
      setVillages([]);
      return [];
    }

    setLoading((prev) => ({
      ...prev,
      villages: true,
    }));

    try {
      const data = await getVillages(districtCode);

      const result = Array.isArray(data) ? data : [];

      setVillages(result);

      return result;
    } catch (error) {
      console.error("Failed to load villages:", error);
      setVillages([]);

      return [];
    } finally {
      setLoading((prev) => ({
        ...prev,
        villages: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const handleProvinceChange = async (event) => {
    const provinceId = event.target.value;

    const province = provinces.find((item) => item.code === provinceId);

    setForm((prev) => ({
      ...prev,

      provinceId,
      province: province?.province ?? "",

      cityId: "",
      city: "",

      districtId: "",
      district: "",

      villageId: "",
      village: "",

      postalCode: "",
    }));

    setCities([]);
    setDistricts([]);
    setVillages([]);

    if (provinceId) {
      await loadCities(provinceId);
    }
  };

  const handleCityChange = async (event) => {
    const cityId = event.target.value;

    const city = cities.find((item) => item.code === cityId);

    setForm((prev) => ({
      ...prev,

      cityId,
      city: city?.regency ?? "",

      districtId: "",
      district: "",

      villageId: "",
      village: "",

      postalCode: "",
    }));

    setDistricts([]);
    setVillages([]);

    if (cityId) {
      await loadDistricts(cityId);
    }
  };

  const handleDistrictChange = async (event) => {
    const districtId = event.target.value;

    const district = districts.find((item) => item.code === districtId);

    setForm((prev) => ({
      ...prev,

      districtId,
      district: district?.district ?? "",

      villageId: "",
      village: "",

      postalCode: "",
    }));

    setVillages([]);

    if (districtId) {
      await loadVillages(districtId);
    }
  };

  const handleVillageChange = (event) => {
    const villageId = event.target.value;

    const village = villages.find((item) => item.code === villageId);

    setForm((prev) => ({
      ...prev,

      villageId,
      village: village?.village ?? "",

      postalCode: village?.postalCode ?? "",
    }));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const initializeRegion = useCallback(
    async (initialData = {}) => {
      if (!initialData?.provinceId) {
        return;
      }

      setForm(createInitialForm(initialData));

      const provinceId = initialData.provinceId;
      const cityId = initialData.cityId;
      const districtId = initialData.districtId;
      const villageId = initialData.villageId;

      const cityData = await loadCities(provinceId);

      if (!cityId) {
        return;
      }

      const city = cityData.find((item) => item.code === cityId);

      const districtData = await loadDistricts(cityId);

      if (!districtId) {
        return;
      }

      const district = districtData.find((item) => item.code === districtId);

      const villageData = await loadVillages(districtId);

      if (!villageId) {
        return;
      }

      const village = villageData.find((item) => item.code === villageId);

      setForm((prev) => ({
        ...prev,

        provinceId,
        province:
          initialData.province ||
          provinces.find((item) => item.code === provinceId)?.province ||
          "",

        cityId,
        city: initialData.city || city?.regency || "",

        districtId,
        district: initialData.district || district?.district || "",

        villageId,
        village: initialData.village || village?.village || "",

        postalCode: initialData.postalCode || village?.postalCode || "",
      }));
    },
    [loadCities, loadDistricts, loadVillages, provinces],
  );

  return {
    form,
    setForm,

    provinces,
    cities,
    districts,
    villages,

    loading,

    onChange: handleChange,
    onProvinceChange: handleProvinceChange,
    onCityChange: handleCityChange,
    onDistrictChange: handleDistrictChange,
    onVillageChange: handleVillageChange,

    initializeRegion,
  };
}
