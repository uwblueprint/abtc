import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import { ServiceRequest } from "../types/ServiceRequestTypes";

type GetServiceRequest = {
  requestId?: string | null;
};
const get = async (): Promise<ServiceRequest[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/serviceRequests`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error: any) {
    return [error];
  }
};

const getById = async ({
  requestId,
}: GetServiceRequest): Promise<ServiceRequest[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/serviceRequests/id/${requestId}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error: any) {
    return [error];
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

const addUserToServiceRequest = async (
  userId: string,
  serviceRequestId: string,
): Promise<ServiceRequest | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      `/serviceRequests/user/${userId}`,
      {
        serviceRequestId,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const deleteShiftById = async (uuid: string): Promise<any> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const data = await baseAPIClient.delete(`/serviceRequests/delete/${uuid}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export default { get, getById, post, deleteShiftById, addUserToServiceRequest };
