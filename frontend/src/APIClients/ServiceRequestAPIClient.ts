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

export default { get, getPlatformSignups };