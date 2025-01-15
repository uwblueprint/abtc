export type Role = "VOLUNTEER" | "ADMIN";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhoneNumber: string;
  role: Role;
  isAccepted?: string | null;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
  tls: {
	rejectUnauthorized: false
}
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";
