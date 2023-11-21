import { volunteerPlatformSignUp } from "@prisma/client";

interface IVolunteerPlatformSignup {
  // ADD PARAMETER AND RETURN TYPES IN NEXT TICKET

  /**
   * Gets volunteer signup
   */
  getVolunteerPlatformSignup(
    adminId: string,
  ): Promise<volunteerPlatformSignUp[]>;

  /**
   * Posts volunteer signup
   */
  postVolunteerPlatformSignup(): Promise<void>;

  /**
   * Edits volunteer signup
   */
  editVolunteerPlatformSignup(): Promise<void>;
}

export default IVolunteerPlatformSignup;
