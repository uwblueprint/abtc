/* eslint-disable class-methods-use-this */
import { platformSignUp, Status } from "@prisma/client";
import prisma from "../../prisma";
import IPlatformSignup, { postPlatformSignupInput } from "../interfaces/platformSignup";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class PlatformSignup implements IPlatformSignup {
  async getPlatformSignups(
  ): Promise<platformSignUp[]> {
    let signUps: platformSignUp[];
    try {
      signUps = await prisma.platformSignUp.findMany();
    } catch (error) {
      Logger.error(
        `Failed to get platform signups. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
    return signUps;
  }


  async postPlatformSignup(platform: postPlatformSignupInput,): Promise<platformSignUp> {
  let newPlatformSignup: platformSignUp;

    try {
        // Check for duplicate email
        const emailUsed = await prisma.platformSignUp.findFirst({
          where: {
              email: platform.email,
          },
        });

        if (emailUsed) {
            throw new Error("The email provided is already in use.");
        }

        newPlatformSignup = await prisma.platformSignUp.create({
            data: platform,
        });
    } catch (error: unknown) {
        Logger.error(
            `Failed to create platform signup. Reason = ${getErrorMessage(error)}`
        );
        throw error;
    }

    return newPlatformSignup;
}

  async editPlatformSignup(signupId:string): Promise<void> {
    try{
          const entryToDelete = await prisma.platformSignUp.findUnique({
                where: { id: signupId },
                });

            if(entryToDelete){
                const deleteUserResult = await prisma.platformSignUp.delete({
                    where: { id: signupId },
                  });

            } else {
                throw new Error(` Signup with ID ${signupId} not found.`);
            }
            
        } catch (error: unknown) {
            console.error(`Failed to delete Signup. Reason = ${getErrorMessage(error)}`)
            throw error;
        }
  }

  async acceptById(signupRequestId: string): Promise<void> {
    try {
      const existingSignup = await prisma.platformSignUp.findUnique({
        where: { id: signupRequestId },
      });

      // Check if  ID is valid
      if (!existingSignup) {
        throw new Error(`Signup with ID ${signupRequestId} not found.`);
      }

      // Update status
      await prisma.platformSignUp.update({
        where: { id: signupRequestId },
        data: { status: Status.ACCEPTED },
      });

    } catch(error: unknown) {
      Logger.error(
        `Failed to accept. Reason = ${getErrorMessage(error)}`
      );
      throw error;
    }
  }

}

export default PlatformSignup;
