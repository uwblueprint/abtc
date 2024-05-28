import * as firebaseAdmin from "firebase-admin";
import { Prisma, Status, user } from "@prisma/client";

import IUserService from "../interfaces/userService";
import { CreateUserDTO, Role, UpdateUserDTO, UserDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";

const Logger = logger(__filename);

const getPrismaUserByAuthId = async (authId: string): Promise<user> => {
  const user = await prisma.user.findFirst({
    where: {
      authId,
    },
  });
  if (!user) {
    throw new Error(`user with authId ${authId} not found.`);
  }
  return user;
};

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */
  async getUserById(userId: string): Promise<UserDTO> {
    let user: user | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }

      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      phoneNumber: user.phoneNumber,
      emergencyFirstName: user.emergencyFirstName,
      emergencyLastName: user.emergencyLastName,
      emergencyPhoneNumber: user.emergencyPhoneNumber,
      role: user.role,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user: user | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await prisma.user.findFirst({
        where: {
          authId: firebaseUser.uid,
        },
      });
      if (!user) {
        throw new Error(`userId with authId ${firebaseUser.uid} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: firebaseUser.email ?? "",
      phoneNumber: user.phoneNumber,
      emergencyFirstName: user.emergencyFirstName,
      emergencyLastName: user.emergencyLastName,
      emergencyPhoneNumber: user.emergencyPhoneNumber,
      role: user.role,
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const user = await getPrismaUserByAuthId(authId);
      return user.role;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user = await getPrismaUserByAuthId(authId);
      return user.id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];

    try {
      const users: Array<user> | null = await prisma.user.findMany();

      userDtos = await Promise.all(
        users?.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
          } catch (error) {
            Logger.error(
              `user with authId ${user.authId} could not be fetched from Firebase`,
            );
            throw error;
          }

          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: firebaseUser.email ?? "",
            role: user.role,
            phoneNumber: user.phoneNumber,
            emergencyFirstName: user.emergencyFirstName,
            emergencyLastName: user.emergencyLastName,
            emergencyPhoneNumber: user.emergencyPhoneNumber,
          };
        }) ?? [],
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(
    user: CreateUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<UserDTO> {
    let newUser: Prisma.userCreateInput;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        // signUpMethod === PASSWORD
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      }

      try {
        newUser = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: firebaseUser.email ?? "",
            authId: firebaseUser.uid,
            phoneNumber: user.phoneNumber,
            emergencyFirstName: user.emergencyFirstName,
            emergencyLastName: user.emergencyLastName,
            emergencyPhoneNumber: user.emergencyPhoneNumber,
            role: user.role,
            isAccepted: Status.PENDING,
            createdAt: new Date().toISOString(),
          },
        });
      } catch (prismaError) {
        // rollback user creation in Firebase
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Prisma user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw prismaError;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: newUser.id ?? "0",
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: firebaseUser.email ?? "",
      phoneNumber: newUser.phoneNumber,
      emergencyFirstName: newUser.emergencyFirstName,
      emergencyLastName: newUser.emergencyLastName,
      emergencyPhoneNumber: newUser.emergencyPhoneNumber,
      role: newUser.role as Role,
    };
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let oldUser: user | null;
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      oldUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          emergencyFirstName: user.emergencyFirstName,
          emergencyLastName: user.emergencyLastName,
          emergencyPhoneNumber: user.emergencyPhoneNumber,
          role: user.role,
        },
      });

      if (!oldUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldUser.authId, { email: user.email });
      } catch (error) {
        // rollback Prisma user updates
        try {
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              firstName: oldUser.firstName,
              lastName: oldUser.lastName,
              phoneNumber: oldUser.phoneNumber,
              emergencyFirstName: oldUser.emergencyFirstName,
              emergencyLastName: oldUser.emergencyLastName,
              emergencyPhoneNumber: oldUser.emergencyPhoneNumber,
              role: oldUser.role,
            },
          });
        } catch (prismaError: unknown) {
          const errorMessage = [
            "Failed to rollback Prisma user update after Firebase user update failure. Reason =",
            getErrorMessage(prismaError),
            "Prisma user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedFirebaseUser.email ?? "",
      phoneNumber: user.phoneNumber,
      emergencyFirstName: user.emergencyFirstName,
      emergencyLastName: user.emergencyLastName,
      emergencyPhoneNumber: user.emergencyPhoneNumber,
      role: user.role,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      if (!deletedUser) {
        throw new Error(`userId ${userId} not found.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        // rollback user deletion in MongoDB
        try {
          await prisma.user.create({
            data: {
              firstName: deletedUser.firstName,
              lastName: deletedUser.lastName,
              email: deletedUser.email ?? "",
              authId: deletedUser.authId,
              phoneNumber: deletedUser.phoneNumber,
              emergencyFirstName: deletedUser.emergencyFirstName,
              emergencyLastName: deletedUser.emergencyLastName,
              emergencyPhoneNumber: deletedUser.emergencyPhoneNumber,
              role: deletedUser.role,
              isAccepted: Status.PENDING,
              createdAt: deletedUser.createdAt,
            },
          });
        } catch (prismaError: unknown) {
          const errorMessage = [
            "Failed to rollback Prisma user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(prismaError),
            "Firebase uid with non-existent Prisma record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);

      // Retrieve the user to be deleted
      const userToDelete = await prisma.user.findFirst({
        where: {
          authId: firebaseUser.uid,
        },
      });

      if (!userToDelete) {
        throw new Error(`authId (Firebase uid) ${firebaseUser.uid} not found.`);
      }

      const deletedUser = await prisma.user.delete({
        where: {
          id: userToDelete.id,
        },
      });

      try {
        await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
      } catch (error) {
        try {
          // rollback user deletion in MongoDB
          await prisma.user.create({
            data: {
              firstName: userToDelete.firstName,
              lastName: userToDelete.lastName,
              email: userToDelete.email ?? "",
              authId: userToDelete.authId,
              phoneNumber: userToDelete.phoneNumber,
              emergencyFirstName: userToDelete.emergencyFirstName,
              emergencyLastName: userToDelete.emergencyLastName,
              emergencyPhoneNumber: userToDelete.emergencyPhoneNumber,
              role: userToDelete.role,
              isAccepted: Status.PENDING,
              createdAt: userToDelete.createdAt,
            },
          });
        } catch (prismaError: unknown) {
          const errorMessage = [
            "Failed to rollback Prisma user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(prismaError),
            "Firebase uid with non-existent Prisma record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default UserService;
