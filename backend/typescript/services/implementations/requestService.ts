import { Prisma, User, PrismaClient } from '@prisma/client';
import IRequestSignup from '../interfaces/requestSignup';
import prisma from "../../prisma";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);


class RequestSignup implements IRequestSignup {
  private prisma: PrismaClient;

  async getRequestSignup(requestId: string): Promise<Prisma.volunteerRequestSignUp | null> {
    try {
      const volunteerRequestSignUpData = await prisma.volunteerRequestSignUp.findUnique({
        where: {
          id: requestId,
          complete: true,
        },
        include: {
          user: true,
        },
      });
      return volunteerRequestSignUpData;
    }
    catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async postVolunteerRequestSignup(userId: string): Promise<Prisma.volunteerRequestSignUp> {
    try {
      const newVolunteerRequestSignup = await prisma.volunteerRequestSignUp.create({
       data: {
         userId: userId,
       }
      })

      return newVolunteerRequestSignup;
     }
     catch (error: unknown) {
     Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
     throw error;
   }
  }

  async editRequestSignup(userId: string, updatedData: Prisma.UserUpdateInput): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedData,
    });
    return updatedUser;
  }
}

export default RequestSignup;
