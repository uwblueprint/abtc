import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import { ServiceRequest } from "../types/ServiceRequestTypes";

const get = async (): Promise<ServiceRequest[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/serviceRequests", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    return [error];
  }
};

const getPlatformSignups = async (): Promise<any[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/platformsignups", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching platform signups:", error);
    throw error;
  }
};

const post = async ({
  requestName,
  requesterId,
  location,
  shiftTime,
  shiftEndTime,
  description,
  meal,
  cookingMethod,
  frequency,
  currentEmail,
  inviteEmails,
  requestType,
}: ServiceRequest): Promise<ServiceRequest | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/serviceRequests/post",
      {
        requestName,
        requesterId,
        location,
        shiftTime,
        shiftEndTime,
        description,
        meal,
        cookingMethod,
        frequency,
        currentEmail,
        inviteEmails,
        requestType,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const getUserByEmail = async (email: string): Promise<{ firstName: string; lastName: string } | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    console.log(`/user-by-email?email=${encodeURIComponent(email)}`)
    const { data } = await baseAPIClient.get(`/serviceRequests/user-by-email?email=${encodeURIComponent(String(email))}`, {
      headers: { Authorization: bearerToken },
    });
    return data; // { firstName: string; lastName: string }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn("User not found for email:", email);
      return null;
    }
    // console.error("Error fetching user by email:", error);
    throw error;
  }
};


export default { get, getPlatformSignups, post, getUserByEmail };