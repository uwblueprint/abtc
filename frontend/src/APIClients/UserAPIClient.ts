import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const getUsers = async (): Promise<any[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/users", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching platform signups:", error);
    throw error;
  }
};

const getUserById = async (userId: string): Promise<any> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/users?userId=${userId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching platform signups:", error);
    throw error;
  }
};

const getUserByEmail = async (email: string): Promise<any> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/users?email=${email}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching platform signups:", error);
    throw error;
  }
};

const acceptUserByEmail = async (email: string): Promise<void> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    await baseAPIClient.get(`/users/accept?email=${email}`, {
      headers: { Authorization: bearerToken },
    });
  } catch (error: any) {
    console.error("Error accepting user: ", error);
    throw error;
  }
};

export default { getUsers, getUserById, acceptUserByEmail, getUserByEmail };
