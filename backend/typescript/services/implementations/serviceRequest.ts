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

  async deleteServiceRequestByID(requestId: string): Promise<void> {
    try {
      const deletedServiceRequest: Partial<Prisma.serviceRequestCreateInput> = await prisma.serviceRequest.delete(
        {
          where: { id: requestId },
        },
      );

      if (!deletedServiceRequest) {
        throw new Error(`requestId ${requestId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete service request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ServiceRequest;
