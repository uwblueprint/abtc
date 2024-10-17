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

export default { get, getPlatformSignups, post };