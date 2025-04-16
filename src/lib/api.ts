
import axios from "axios";
import { Problem } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Authentication
export const registerSendOtp = async (email: string) => {
  const response = await axios.post(`${API_URL}/users/register/send-otp`, { email });
  return response.data;
};

export const registerVerify = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  otp: string;
}) => {
  const response = await axios.post(`${API_URL}/users/register/verify`, userData);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/users/me`, {
    headers: { "x-auth-token": token }
  });
  return response.data;
};

// Problems
export const getProblems = async () => {
  const response = await axios.get(`${API_URL}/problems`);
  return response.data;
};

export const getProblemById = async (id: string) => {
  const response = await axios.get(`${API_URL}/problems/${id}`);
  return response.data;
};

export const createProblem = async (problemData: any, token: string) => {
  const response = await axios.post(`${API_URL}/problems`, problemData, {
    headers: { "x-auth-token": token }
  });
  return response.data;
};

export const updateProblemStatus = async (id: string, status: string, token: string) => {
  const response = await axios.patch(
    `${API_URL}/problems/${id}/status`,
    { status },
    { headers: { "x-auth-token": token } }
  );
  return response.data;
};

export const upvoteProblem = async (id: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/problems/${id}/upvote`,
    {},
    { headers: { "x-auth-token": token } }
  );
  return response.data;
};

// Search
export const searchByPincode = async (pincode: string) => {
  const response = await axios.get(`${API_URL}/search/pincode/${pincode}`);
  return response.data;
};
