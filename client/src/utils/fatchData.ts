import axios from "axios";

const baseUrl = "http://localhost:4000";
const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (config) => {
    const persistedUsers = localStorage.getItem("persist:users");
    let token;

    if (persistedUsers) {
      const users = JSON.parse(persistedUsers);
      if (users.token) {
        // Remember to parse the token if it's still a JSON string
        token = JSON.parse(users.token);
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchLogin = async (data: {
  userName: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, data);
    console.log("hey", response.data);
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchAddDepartment = async (departmentName: string) => {
  try {
    const response = await api.post("/departments/", { name: departmentName });
    if (response.status === 201) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchGetAllDepartments = async () => {
  try {
    const response = await api.get("/departments/");
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchDeleteDepartment = async (id: string) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchUpdateDepartment = async (
  departmentId: string,
  departmentName: string
) => {
  try {
    const response = await api.put(`/departments/${departmentId}`, {
      name: departmentName,
    });
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchAddEmployee = async (data = {}) => {
  try {
    const response = await api.post("/employees/", data);
    if (response.status === 201) return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchGetAllEmployees = async () => {
  try {
    const response = await api.get("/employees/");
    if (response.status === 200) return response.data;
  } catch (err) {
    console.log(err);
  }
};
