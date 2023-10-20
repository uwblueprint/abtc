export type Role = "User" | "Admin";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
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
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";

export type ServiceRequestDTO = {
  id: string;
  requestName: string;
  requesterId: string;
  location: string;
  shiftTime?: Date;
  description?: string;
  meal?: string;
  cookingMethod: string;
  frequency: string;
  requestType: ServiceRequestType;
};

export type CreateServiceRequestDTO = Omit<ServiceRequestDTO, "id">;

export type ServiceRequestType = "SITE" | "KITCHEN";