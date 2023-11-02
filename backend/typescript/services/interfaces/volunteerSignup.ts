import { volunteerPlatformSignUp } from "@prisma/client";

interface IVolunteerSignup {

   /**
   * Gets volunteer signup
   */
   getVolunteerSignup(id: string): Promise<volunteerPlatformSignUp>;

   /**
   * Posts volunteer signup
   */    
    postVolunteerSignup(): Promise<void>

   /**
   * Edits volunteer signup
   */
    editVolunteerSignup(): Promise<void>

}
  
export default IVolunteerSignup;
  