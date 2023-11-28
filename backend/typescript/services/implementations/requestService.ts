import { Prisma } from '@prisma/client';
import IRequestSignup from '../interfaces/requestService';
import prisma from "../../prisma";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);


class RequestSignup implements IRequestSignup {

  async getVolunteerRequestSignup(requestId: string): Promise<Prisma.volunteerRequestSignUp | null> {
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

  async editRequestSignup(serviceRequestId: string,
    userId: string, newDataObject: Partial<Prisma.volunteerRequestSignUp> ): Promise<Prisma.volunteerRequestSignUp> {
    let validVolunteerRequestSignup: Prisma.volunteerRequestSignUp | null = null;
    let updatedVolunteerRequestSignup: Prisma.volunteerRequestSignUpUpdateInput;

   try {
     // Check the volunteer request signup entry exists. Query through the user table.
     validVolunteerRequestSignup = await prisma.user.findUnique({
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

    if (!validVolunteerRequestSignup) {
      throw new Error('Original request signup entry not found');
    }

    try{
      // Update the volunteer request signup entry with new data. Query through the user table.
      updatedVolunteerRequestSignup = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          volunteerRequestSignUp: {
            update: {
              where: {
                id: serviceRequestId,
              },
              data: {
              ...newDataObject,}
            },
          },
        },
      });
    }
    catch (error: unknown) {
      Logger.error(`Failed to update request signup entry. Reason = ${getErrorMessage(error)}`);
      throw new Error('Failed to update request signup entry');
    }
   } catch (error: unknown) {
     Logger.error(`Failed to edit request signup. Reason = ${getErrorMessage(error)}`);
     throw error;
   }


   return updatedVolunteerRequestSignup;
  }
}

export default RequestSignup;
