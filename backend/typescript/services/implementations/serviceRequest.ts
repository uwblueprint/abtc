import { Prisma } from "@prisma/client";
import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";

const Logger = logger(__filename);

class ServiceRequest implements IServiceRequest {
  /* eslint-disable class-methods-use-this */

  // get method here
  async getServiceRequestByID(
    requestId: string,
  ): Promise<Prisma.getServiceRequestByID> {}

  // post method here
  async postServiceRequest(
    serviceRequest: Prisma.serviceRequestCreateInput,
  ): Promise<Prisma.serviceRequestCreateInput> {}

  async deleteServiceRequestByID(requestId: string): Promise<void> {}
}

export default ServiceRequest;
