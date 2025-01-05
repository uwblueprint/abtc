import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { LOGIN_PAGE } from "../constants/Routes";

export const logout = async (urlParam = "") => {
  localStorage.removeItem(AUTHENTICATED_USER_KEY);
  window.location.href = LOGIN_PAGE + (urlParam ? `?${urlParam}=true` : "");
};

export default logout;
