import axios from "axios";

const baseUrl = "http://localhost:4000";

export const fetchLogin = async (data: {
  userName: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, data);
    console.log("hey", response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
