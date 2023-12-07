import { Prisma } from '@prisma/client';

interface IRequestSignup {
  /**
   * Remove serviceRequest from user's list of serviceRequests.
   * @param serviceRequestID - The unique identifier of the serviceRequest to be removed
   * @param userID - The user's id
   * @returns A promise that resolves to the updated user.
   */
  
  removeRequestSignup(serviceRequestID: string, userID: string): Promise<Prisma.User>;
}

export default IRequestSignup;