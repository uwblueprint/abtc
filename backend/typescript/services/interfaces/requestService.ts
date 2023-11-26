import { Prisma, UserCreateInput, UserUpdateInput } from '@prisma/client';

interface IRequestSignup {
  /**
   * Get information for a volunteer signup reqeust by its unique ID.
   * @param requestId - The unique identifier of the request.
   * @returns A promise that resolves to request data or null if not found.
   */
  getVolunteerRequestSignup(requestId: string): Promise<Prisma.volunteerRequestSignUp | null>;

  /**
   * Generate a volunteer shift signup request.
   * @param userId - The unique identifier of the user associated with the request.
   * @returns A promise that resolves to the newly generated request.
 */
  postVolunteerRequestSignup(userID: string): Promise<Prisma.volunteerRequestSignUp>;

  /**
    * Update a volunteer shift signup request.
    * @param serviceRequestId - The unique identifier of the request.
    * @param userId - The unique identifier of the user associated with the request.
    * @param newVolunteerRequestSignUp - The new request data.
    * @returns A promise that resolves to the updated request.
   */
  editRequestSignup(serviceRequestId: string,
    userId: string, newVolunteerRequestSignUp: Prisma.volunteerRequestSignUp): Promise<Prisma.volunteerRequestSignUp>;
}

export default IRequestSignup;
