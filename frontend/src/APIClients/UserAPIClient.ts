import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

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

export default { acceptUserByEmail };
