import React, { useContext, useState, useEffect } from "react";
import { Redirect, useHistory, Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, FormControl, Text, Input, Flex, FormLabel, Center, Link, Button } from "@chakra-ui/react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

<GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}>
  ...
</GoogleOAuthProvider>;


const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) { setError(null) }
  }, [email, password])

  const onLogInClick = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user: AuthenticatedUser = await authAPIClient.login(email, password);
      setAuthenticatedUser(user);
    } catch (_error) {
      setError("Invalid email or password");
    }
    const onLogInClick = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        const user: AuthenticatedUser = await authAPIClient.login(
          email,
          password,
        );
        setAuthenticatedUser(user);
      } catch (_error) {
        setError("Invalid email or password");
      }
    };

    const onGoogleLoginSuccess = async (idToken: string) => {
      const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
        idToken,
      );
      setAuthenticatedUser(user);
    };

    if (authenticatedUser) {
      return <Redirect to={HOME_PAGE} />;
    }

    return (
      <Flex
        width="100vw"
        height="100vh"
        align="center"
        justify="center"
        background="#404040"
      >
        <Box
          width="md"
          pt={16}
          pr={16}
          pl={16}
          pb={10}
          m={5}
          background="white"
          rounded={20}
        >
          <Box pb={4} textAlign="left">
            <Heading size="lg">Log In</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={onLogInClick}>
              <FormControl border={2} borderColor="#0B0B0B">
                <FormLabel>E-mail</FormLabel>
                <Input
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  borderColor={error ? "red.500" : "black"}
                />
                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="right">
                    {error}
                  </Text>
                )}
              </FormControl>
              <FormControl mt={6} border={2}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  borderColor={error ? "red.500" : "black"}
                />
                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="right">
                    {error}
                  </Text>
                )}
                <Box textAlign="right">
                  <Link
                    as={ReactRouterLink}
                    to="/forgot-password"
                    textDecoration="underline"
                    fontSize="sm"
                    _hover={{ color: "#28214C" }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </FormControl>
              <Center mt={4} mb={4}>
                <Button
                  type="submit"
                  isDisabled={email === "" || password === ""}
                  width="full"
                  mt={4}
                  color="white"
                  background="#28214C"
                  _hover={{ opacity: "0.8" }}
                >
                  Log In
                </Button>
              </Center>
              <Center>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      onGoogleLoginSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </Center>
              <Center>
                <Text mt={4} fontSize="sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    as={ReactRouterLink}
                    to={SIGNUP_PAGE}
                    textDecoration="underline"
                    fontWeight="semibold"
                  >
                    Register
                  </Link>
                </Text>
              </Center>
            </form>
          </Box>
        </Box>
      </Flex>


    );
  };

  export default Login;