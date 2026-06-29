import axios from "axios";

const API_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export const getProvinces = async () => {
  return await axios.get(`${API_URL}/provinces.json`);
};

export const getCities = async (provinceId) => {
  return await axios.get(`${API_URL}/regencies/${provinceId}.json`);
};

export const getDistricts = async (cityId) => {
  return await axios.get(`${API_URL}/districts/${cityId}.json`);
};

export const getVillages = async (districtId) => {
  return await axios.get(`${API_URL}/villages/${districtId}.json`);
};
