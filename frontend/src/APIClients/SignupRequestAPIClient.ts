import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

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

const deletePlatformSignup = async (uuid: string): Promise<any[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.delete(
      `/platformsignups/delete/${uuid}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting platform signup", error);
    throw error;
  }
};

const acceptPlatformSignup = async (uuid: string): Promise<any[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/platformsignups/accept/${uuid}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting platform signup", error);
    throw error;
  }
};

const rejectPlatformSignup = async (uuid: string): Promise<any[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/platformsignups/reject/${uuid}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting platform signup", error);
    throw error;
  }
};

export default {
  getPlatformSignups,
  deletePlatformSignup,
  acceptPlatformSignup,
  rejectPlatformSignup,
};
