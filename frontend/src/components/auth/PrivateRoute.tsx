import React, { useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const shiftId = queryParams.get('shiftId');

  if (authenticatedUser) {
    return <Route path={path} exact={exact} component={component} />
  }

  if (shiftId) {
    localStorage.setItem('shiftId', shiftId)
  }

  return <Redirect to={LOGIN_PAGE} />
};

export default PrivateRoute;
