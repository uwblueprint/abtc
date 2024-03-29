import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const get = async (): Promise<any> => {
    const bearerToken = `Bearer ${getLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
    )}`;
    try {
        const { data } = await baseAPIClient.get("/serviceRequests", {
            headers: { Authorization: bearerToken },
        });
        return data;
    } catch (error) {
        return error;
    }
}

export default { get };