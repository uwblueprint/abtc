import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
  adminOnly?: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
  adminOnly,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  if (adminOnly) {
    if (authenticatedUser?.role !== "ADMIN") {
      return <Redirect to={LOGIN_PAGE} />;
    }
  }

  console.log("authenticatedUser", authenticatedUser);
  return authenticatedUser ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to={LOGIN_PAGE} />
  );
};

export default PrivateRoute;
