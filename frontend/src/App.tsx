import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import SimpleEntityCreatePage from "./components/pages/SimpleEntityCreatePage";
import SimpleEntityDisplayPage from "./components/pages/SimpleEntityDisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import SimpleEntityUpdatePage from "./components/pages/SimpleEntityUpdatePage";
import Dashboard from "./components/pages/Dashboard";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";
import Shifts from "./components/pages/Shifts";

import { AuthenticatedUser } from "./types/AuthTypes";
import SignupEmergencyContact from "./components/auth/SignupEmergencyContact";
import SignupSecondary from "./components/auth/SignupSecondary";
import CustomizedCalendar from "./components/pages/Calendar/CustomizedCalendar";
import PlatformSignupRequests from "./components/pages/PlatformSignupRequests";
import AccountDirectory from "./components/pages/AccountDirectory";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}>
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <Router>
          <Switch>
            <Route exact path={Routes.LOGIN_PAGE} component={Login} />
            <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
            <Route
              exact
              path={Routes.SIGNUP_SECONDARY}
              component={SignupSecondary}
            />
            <Route
              exact
              path={Routes.SIGNUP_EMERGENCY_CONTACT}
              component={SignupEmergencyContact}
            />
            <PrivateRoute exact path={Routes.HOME_PAGE} component={Dashboard} />
            <PrivateRoute
              exact
              path={Routes.CREATE_ENTITY_PAGE}
              component={CreatePage}
            />
            <PrivateRoute
              exact
              path={Routes.UPDATE_ENTITY_PAGE}
              component={UpdatePage}
            />
            <PrivateRoute
              exact
              path={Routes.DISPLAY_ENTITY_PAGE}
              component={DisplayPage}
            />
            <PrivateRoute
              exact
              path={Routes.CREATE_SIMPLE_ENTITY_PAGE}
              component={SimpleEntityCreatePage}
            />
            <PrivateRoute
              exact
              path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}
              component={SimpleEntityUpdatePage}
            />
            <PrivateRoute
              exact
              path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}
              component={SimpleEntityDisplayPage}
            />
            <PrivateRoute
              exact
              path={Routes.CALENDAR_PAGE}
              component={CustomizedCalendar}
            />
            <PrivateRoute
              exact
              path={Routes.EDIT_TEAM_PAGE}
              component={EditTeamInfoPage}
            />
            <PrivateRoute
              exact
              path={Routes.HOOKS_PAGE}
              component={HooksDemo}
            />
            <PrivateRoute exact path={Routes.SHIFTS_PAGE} component={Shifts} />
            <PrivateRoute
              exact
              path={Routes.DASHBOARD_PAGE}
              component={Dashboard}
            />
            <PrivateRoute
              exact
              path={Routes.PLATFORM_SIGNUP_REQUESTS}
              component={PlatformSignupRequests}
              adminOnly
            />
            <PrivateRoute
              exact
              path={Routes.ACCOUNT_DIRECTORY}
              component={AccountDirectory}
              adminOnly
            />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
