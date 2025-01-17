import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser, Role } from "../types/AuthTypes";
import baseAPIClient from "./BaseAPIClient";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";
import { SignupRequest } from "../types/SignupFormTypes";
import NotificationAPIClient from "./NotificationAPIClient";
import { NotificationType } from "../types/NotificationTypes";

const login = async (
  email: string,
  password: string,
): Promise<AuthenticatedUser> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const loginWithGoogle = async (idToken: string): Promise<AuthenticatedUser> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { idToken },
      { withCredentials: true },
    );
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

const logout = async (userId: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const register = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  emergencyFirstName,
  emergencyLastName,
  emergencyPhoneNumber,
}: SignupRequest): Promise<AuthenticatedUser> => {
  try {
    const role: Role = "VOLUNTEER";
    const { data } = await baseAPIClient.post(
      "/auth/register",
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        emergencyFirstName,
        emergencyLastName,
        emergencyPhoneNumber,
        role,
      },
      { withCredentials: true },
    );
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    NotificationAPIClient.post({
      assigneeId: "",
      adminView: true,
      firstName,
      lastName,
      shiftId: "",
      requesterId: "",
      notificationTitle: "Platform Request",
      notificationDescription: `${firstName} ${lastName} has requested access to the platform`,
      type: NotificationType.PLATFORM,
    });
    return data;
  } catch (error) {
    return null;
  }
};

const resetPassword = async (email: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const {
      data: { exists },
    } = await baseAPIClient.get(`/auth/checkEmail?email=${email}`);
    return exists;
  } catch (error) {
    return false;
  }
};

export default {
  login,
  logout,
  loginWithGoogle,
  register,
  resetPassword,
  refresh,
  checkEmailExists,
};
