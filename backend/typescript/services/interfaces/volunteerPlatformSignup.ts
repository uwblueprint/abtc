import { Prisma } from "@prisma/client";

interface IVolunteerPlatformSignup {
    // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

   /**
   * Gets volunteer signup
   */
   getVolunteerPlatformSignup(): Promise<void>;

   /**
   * Posts volunteer signup
   * @param volunteerPlatform the volunteerPlatform to be created
   * @returns a volunteerPlatformSignUp with the provided information
   * @throws Error if user creation fails
   */    
    postVolunteerPlatformSignup(
        volunteerPlatform: Prisma.volunteerPlatformSignUp,
    ): Promise<Prisma.volunteerPlatformSignUp>

   /**
   * Edits volunteer signup
   */
    editVolunteerPlatformSignup(): Promise<void>

}
  
export default IVolunteerPlatformSignup;