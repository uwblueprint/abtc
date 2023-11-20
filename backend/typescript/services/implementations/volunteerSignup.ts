import IVolunteerPlatformSignup from "../interfaces/volunteerSignup";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";


class VolunteerSignup implements IVolunteerPlatformSignup{
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

    async getVolunteerSignup(): Promise<void> {
        // Implementation to be added
    }

    async postVolunteerSignup(): Promise<void> {
        // Implementation to be added
    }

    async deleteVolunteerSignup(volunteerSignupId:string): Promise<void> {
        try{
            const entryToDelete = await prisma.volunteerPlatformSignUp.findUnique({
                where: { id: volunteerSignupId },
                });

            if(entryToDelete){
                const deleteUserResult = await prisma.volunteerPlatformSignUp.delete({
                    where: { id: volunteerSignupId },
                  });

            } else {
                throw new Error(`Volunteer Signup with ID ${volunteerSignupId} not found.`);
            }
            
        } catch (error: unknown) {
            console.error(`Failed to delete Volunteer Signup. Reason = ${getErrorMessage(error)}`)
            throw error;
        }

    }

}

export default VolunteerSignup;
