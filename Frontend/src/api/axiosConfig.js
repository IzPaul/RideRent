import axios from "axios";

//const baseURL = process.env.REACT_APP_API_URL ;
const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    //add auth token diri  later
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

console.log("API Base URL:", process.env.REACT_APP_API_URL);
console.log("Using API Base URL:", baseURL);

export const uploadImage = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default api;