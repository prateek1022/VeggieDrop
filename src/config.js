import axios from "axios";
const ip="192.168.0.12";  
export const BASE_URL      = "http://"+ip+":8002/";
export const BASE_URL_cust = "http://"+ip+":8001/"; 


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosInstance_cust = axios.create({
  baseURL: BASE_URL_cust,
});