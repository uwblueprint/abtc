import IVolunteerPlatformSignup from "../interfaces/volunteerSignup";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

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
            
        }catch (error) {
            throw error;
        }

    }

}

export default VolunteerSignup;
