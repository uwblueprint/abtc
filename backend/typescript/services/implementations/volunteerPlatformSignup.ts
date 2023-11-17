import { Prisma, volunteerPlatformSignUp } from "@prisma/client";
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
          adminId,
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

  async postVolunteerPlatformSignup(): Promise<void> {
    // Implementation to be added
  }

  async editVolunteerPlatformSignup(): Promise<void> {
    // Implementation to be added
  }

}

export default VolunteerPlatformSignup;
