interface IServiceRequest {
  // get method here

  // post method here

  /**
   * Delete a serviceRequest by id
   * @param requestId serviceRequest's id
   * @throws Error if serviceRequest deletion fails
   */
  deleteServiceRequestByID(requestId: string): Promise<void>;
}

export default IServiceRequest;
