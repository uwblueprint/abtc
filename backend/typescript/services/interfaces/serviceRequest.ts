import { CreateServiceRequestDTO, ServiceRequestDTO } from "../../types";

interface IServiceRequest {
  // get method here

  // post method here
  /**
   * Create a serviceRequest
   * @param serviceRequest the serviceRequest to be created
   * @returns a ServiceRequestDTO with the created serviceRequest's information
   * @throws Error if serviceRequest creation fails
   */
  postServiceRequest(serviceRequest: CreateServiceRequestDTO): Promise<ServiceRequestDTO>;

  /**
   * Delete a serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest deletion fails
   */
  deleteServiceRequestByID(requestId: string): Promise<void>;
}

export default IServiceRequest;
