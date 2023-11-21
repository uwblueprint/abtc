import { Prisma, serviceRequest } from "@prisma/client";
import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";

const Logger = logger(__filename);

class ServiceRequest implements IServiceRequest {
  /* eslint-disable class-methods-use-this */

  async getServiceRequestByID(
    requestId: string,
): Promise<serviceRequest> {
    try {
        const serviceRequest: serviceRequest | null = await prisma.serviceRequest.findUnique({
            where: {
                id: requestId,
            },
        });

        if (!serviceRequest) {
            throw new Error("Service request not found.")
        }

        return serviceRequest;
    } catch (error) {
        throw new Error("Error retrieving service request.");
    }
}

  async postServiceRequest(
    serviceRequest: Prisma.serviceRequestCreateInput,
  ): Promise<serviceRequest> {
    let newServiceRequest: serviceRequest
    try {
      // Verify that requester user exists
      const requesterId = serviceRequest.requester.connect?.id
      if (!requesterId) {
        throw new Error("Only existing users can create service requests.");
      }
      const userExists = await prisma.user.findUnique({
        where: {
          id: requesterId,
        },
      });
      if (!userExists) {
        throw new Error("Only existing users can create service requests.");
      }
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
