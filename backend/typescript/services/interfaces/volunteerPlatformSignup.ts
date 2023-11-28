import { Prisma, volunteerPlatformSignUp } from "@prisma/client";


interface IVolunteerPlatformSignup {
  /**
   * Gets volunteer signup
   */
  getVolunteerPlatformSignup(
    adminId: string,
  ): Promise<volunteerPlatformSignUp[]>;

  /**
   * Posts volunteer signup
   * @param volunteerPlatform the volunteerPlatform to be created
   * @returns a volunteerPlatformSignUp with the provided information
   * @throws Error if user creation fails
   */    
    postVolunteerPlatformSignup(
        volunteerPlatform: volunteerPlatformSignUp,
    ): Promise<volunteerPlatformSignUp>


  /**
   * Edits volunteer signup
   */
  editVolunteerPlatformSignup(): Promise<void>;
}

export default IVolunteerPlatformSignup;
