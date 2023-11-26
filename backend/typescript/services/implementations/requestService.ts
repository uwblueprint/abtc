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
    userId: string, newVolunteerRequestSignUp: Prisma.volunteerRequestSignUp): Promise<any> {
    let existingRequestSignup: Prisma.volunteerRequestSignUp | null = null;
    let updatedVolunteerRequestSignup: Prisma.volunteerRequestSignUpUpdateInput;

   try {
    // Retrieve the existing request signup entry
    existingRequestSignup = await prisma.volunteerRequestSignUp.findUnique({
      where: {
        serviceRequestId: serviceRequestId,
        userId: userId
      },
    });

    if (!existingRequestSignup) {
      throw new Error('Original request signup entry not found');
    }

    try{
      // Update the fields with the provided values
      updatedVolunteerRequestSignup = await prisma.volunteerRequestSignUp.update({
        where: {
          id: existingRequestSignup.id,
        },
        data: newVolunteerRequestSignUp,
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
