import { volunteerPlatformSignUp } from "@prisma/client";
import prisma from "../../prisma";
import IVolunteerPlatformSignup from "../interfaces/volunteerPlatformSignup";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class VolunteerPlatformSignup implements IVolunteerPlatformSignup {
  async getVolunteerPlatformSignup(
    adminId: string,
  ): Promise<volunteerPlatformSignUp[]> {
    let volunteerSignUps: volunteerPlatformSignUp[];
    try {
      volunteerSignUps = await prisma.volunteerPlatformSignUp.findMany({
        where: {
          admin_id : adminId
        },
      });
    } catch (error) {
      Logger.error(
        `Failed to get volunteer platform signups. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
    return volunteerSignUps;
  }


  async postVolunteerPlatformSignup(
    volunteerPlatform: volunteerPlatformSignUp
): Promise<volunteerPlatformSignUp> {
  let newVolunteer: volunteerPlatformSignUp;

    try {
        // Check for duplicate email
        const emailUsed = await prisma.volunteerPlatformSignUp.findMany({
          where: {
              email: volunteerPlatform.email,
          },
      });

        if (emailUsed) {
            throw new Error("The email provided is already in use.");
        }

        newVolunteer = await prisma.volunteerPlatformSignUp.create({
            data: volunteerPlatform,
        });
    } catch (error: unknown) {
        Logger.error(
            `Failed to create volunteer platform. Reason = ${getErrorMessage(error)}`
        );
        throw error;
    }

    return newVolunteer;
}

  async editVolunteerPlatformSignup(): Promise<void> {
    // Implementation to be added
  }

}

export default VolunteerPlatformSignup;
