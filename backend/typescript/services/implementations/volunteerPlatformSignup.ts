import IVolunteerPlatformSignup from "../interfaces/volunteerPlatformSignup";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

const Logger = logger(__filename);

class VolunteerPlatformSignup implements IVolunteerPlatformSignup{
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

    async getVolunteerPlatformSignup(): Promise<void> {
        // Implementation to be added
    }

    async postVolunteerPlatformSignup(
        volunteerPlatform: Prisma.volunteerPlatformSignUp,
    ): Promise<Prisma.volunteerPlatformSignUp> {
        let newVolunteer: Prisma.volunteerPlatformSignUp;
        try {
            // Check for duplicate email
            const emailUsed = await prisma.volunteerPlatformSignUp.findUnique({
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
