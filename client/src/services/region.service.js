import axios from "axios";

const API_URL = "https://konoland-api.vercel.app";

export const getProvinces = async () => {
  const response = await axios.get(`${API_URL}/province`, {
    params: {
      limit: 100,
    },
  });

  return response.data.data;
};

export const getCities = async (provinceCode) => {
  const response = await axios.get(`${API_URL}/regency`, {
    params: {
      provinceCode,
      limit: 1000,
    },
  });

  return response.data.data;
};

export const getDistricts = async (regencyCode) => {
  const response = await axios.get(`${API_URL}/district`, {
    params: {
      regencyCode,
      limit: 1000,
    },
  });

  return response.data.data;
};

export const getVillages = async (districtCode) => {
  const response = await axios.get(`${API_URL}/village`, {
    params: {
      districtCode,
      limit: 1000,
    },
  });

  return response.data.data;
};
