import { Prisma, User } from '@prisma/client';
import IRequestSignup from '../interfaces/requestService';
import prisma from "../../prisma";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);


class RequestSignup implements IRequestSignup {

  async getVolunteerRequestSignup(serviceRequestId: string, userId: string): Promise<Prisma.users | null> {
    try { 
      // Query for volunteerSignUpRequest through the user table
      const volunteerRequestSignUpData = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          volunteerRequestSignUp: {
            where: {
              id: serviceRequestId,
            },
          },
        },
      }); 

      if (!volunteerRequestSignUpData) {
        throw new Error('Request signup entry not found');
      }

      return volunteerRequestSignUpData;
    }
    catch (error: unknown) {
      Logger.error(`Failed to get request information. Reason = ${getErrorMessage(error)}`);
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
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedData,
    });
    return updatedUser;
  }
}

export default RequestSignup;
