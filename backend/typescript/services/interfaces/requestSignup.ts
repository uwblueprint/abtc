import { Prisma, UserCreateInput, UserUpdateInput } from '@prisma/client';

interface IRequestSignup {
  /**
   * Get user information by their unique ID.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to user data or null if not found.
   */
  getRequestSignup(userId: string): Promise<Prisma.User | null>;

  /**
   * Generate a volunteer shift signup request.
   * @param userId - The unique identifier of the user associated with the request.
   * @returns A promise that resolves to the newly generated request.
 */
  postVolunteerRequestSignup(userID: string): Promise<Prisma.volunteerRequestSignUp>;

  /**
   * Update user information based on their unique ID.
   * @param userId - The unique identifier of the user to be updated.
   * @param updatedData - The data to update the user's information.
   * @returns A promise that resolves to the updated user.
   */
  editRequestSignup(userId: string, updatedData: UserUpdateInput): Promise<Prisma.User>;
}

export default IRequestSignup;
