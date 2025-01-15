import { Prisma, serviceRequest } from "@prisma/client";

interface IServiceRequest {
  /**
   * Get all serviceRequests
   * @returns an array of serviceRequests
   * @throws Error if serviceRequest getting fails
   */
  getServiceRequests(): Promise<serviceRequest[]>;

  /**
   * Get serviceRequests by requesterId
   * @param requesterId requester's id
   * @returns an array of serviceRequests
   * @throws Error if serviceRequest getting fails
   */
  getServiceRequestsByRequesterId(requesterId: string): Promise<serviceRequest[]>;

  /**
   * Add serviceRequest to a requester
   * @param requesterId requester's id
   * @param serviceRequestId the serviceRequest's id to be added
   * @throws Error if serviceRequest addition fails
   */
  postServiceRequestByRequesterId(
    requesterId: string,
    serviceRequestId: string,
  ): Promise<serviceRequest>;

  /**
   * Get serviceRequests by userId
   * @param userId user's id
   * @returns an array of serviceRequests
   * @throws Error if serviceRequest getting fails
   */
  getServiceRequestsByUserId(userId: string): Promise<serviceRequest[]>;

  /**
   * Add serviceRequest to a user
   * @param userId user's id
   * @param serviceRequestId the serviceRequest's id to be added
   * @throws Error if serviceRequest addition fails
   */
  postServiceRequestByUserId(
    userId: string,
    serviceRequestId: string,
  ): Promise<void>;

   /**
   * Remove serviceRequest from a user
   * @param userId user's id
   * @param serviceRequestId the serviceRequest's id to be added
   * @throws Error if serviceRequest addition fails
   */
  postRemoveServiceRequestByUserId(
    userId: string,
    serviceRequestId: string,
  ): Promise<void>;

  /**
   * Get serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest getting fails
   */
  getServiceRequestByID(requestId: string): Promise<serviceRequest>;

  /**
   * Create a serviceRequest
   * @param serviceRequest the serviceRequest to be created
   * @returns a ServiceRequestDTO with the created serviceRequest's information
   * @throws Error if serviceRequest creation fails
   */
  postServiceRequest(inputServiceRequest: any): Promise<serviceRequest>;

  /**
   * Delete a serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest deletion fails
   */
  deleteServiceRequestByID(requestId: string): Promise<void>;
}

export default IServiceRequest;
