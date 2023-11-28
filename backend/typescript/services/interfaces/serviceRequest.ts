import { Prisma, serviceRequest } from "@prisma/client";

interface IServiceRequest {
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
    serviceRequest: Prisma.serviceRequestCreateInput,
  ): Promise<serviceRequest>;

  /**
   * Delete a serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest deletion fails
   */
  deleteServiceRequestByID(requestId: string): Promise<void>;
}

export default IServiceRequest;
