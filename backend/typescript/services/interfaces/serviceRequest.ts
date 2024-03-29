import { Prisma, serviceRequest } from "@prisma/client";

interface IServiceRequest {
  /**
   * Get all serviceRequests
   * @returns an array of serviceRequests
   * @throws Error if serviceRequest getting fails
   */
  getServiceRequests(): Promise<serviceRequest[]>;

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
  postServiceRequest(
    inputServiceRequest: any,
  ): Promise<serviceRequest>;

  /**
   * Delete a serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest deletion fails
   */
  deleteServiceRequestByID(requestId: string): Promise<void>;
}

export default IServiceRequest;
