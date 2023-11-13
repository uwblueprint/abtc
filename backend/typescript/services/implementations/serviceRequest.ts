import { Prisma } from "@prisma/client";
import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";

const Logger = logger(__filename);

class ServiceRequest implements IServiceRequest {
  /* eslint-disable class-methods-use-this */

  async getServiceRequestByID(
    requestId: string,
  ): Promise<Prisma.getServiceRequestByID> {}

  async postServiceRequest(
    serviceRequest: Prisma.serviceRequestCreateInput,
  ): Promise<Partial<Prisma.serviceRequestCreateInput>> {
    let newServiceRequest: Partial<Prisma.serviceRequestCreateInput>;
    try {
      newServiceRequest = await prisma.serviceRequest.create({
        data: serviceRequest,
      });
    } catch (error) {
      Logger.error(
        `Failed to create service request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return newServiceRequest;
  }

  async deleteServiceRequestByID(requestId: string): Promise<void> {}
}

export default ServiceRequest;
