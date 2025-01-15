import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

import { Notification } from "../types/NotificationTypes";

type GetNotification = {
  assigneeId?: string | null;
};

type UpdateNotification = {
  notificationId?: string | null;
};

const getById = async ({
  assigneeId,
}: GetNotification): Promise<Notification[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/notification/assignee/${assigneeId}`,
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
  assigneeId,
  notificationTitle,
  notificationDescription,
  requesterId,
  type,
}: Notification): Promise<Notification | null> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    const { data } = await baseAPIClient.post(
      "/notification/post",
      {
        assigneeId,
        notificationTitle,
        notificationDescription,
        requesterId,
        type,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const updateChecked = async ({
  notificationId,
}: UpdateNotification): Promise<Notification> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/notification/update/${notificationId}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error: any) {
    return error;
  }
};

export default {
  getById,
  post,
  updateChecked,
};
