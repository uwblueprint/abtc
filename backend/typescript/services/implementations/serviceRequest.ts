import { Prisma, serviceRequest, user } from "@prisma/client";
import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";
import { log } from "console";

const Logger = logger(__filename);

class ServiceRequest implements IServiceRequest {
  /* eslint-disable class-methods-use-this */

  async getServiceRequests(): Promise<serviceRequest[]> {
    try {
      const serviceRequests: serviceRequest[] = await prisma.serviceRequest.findMany();
      if (serviceRequests.length === 0) {
        throw new Error("Service requests not found.");
      }
      return serviceRequests;
    } catch (error) {
      throw new Error("Error retrieving service requests.");
    }
  }

  async getServiceRequestsByUserId(userId: string): Promise<serviceRequest[]> {
    try {
      log("userId: ", userId);
      const currUser = (await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          serviceRequests: true,
        },
      })) as user & { serviceRequests: serviceRequest[] };
      log("currUser: ", currUser);
      if (!currUser) {
        throw new Error("User not found.");
      }
      return currUser.serviceRequests;
    } catch (error) {
      throw new Error("Error retrieving service requests.");
    }
  }

  async postServiceRequestByUserId(
    userId: string,
    serviceRequestId: string,
  ): Promise<void> {
    try {
      log("userId: ", userId);
      const newServiceRequest = await prisma.serviceRequest.findUnique({
        where: {
          id: serviceRequestId,
        },
      });
      log("newServiceRequest: ", newServiceRequest);
      if (!newServiceRequest) {
        throw new Error("Service request not found.");
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          serviceRequests: true,
        },
      });
      log("existingUser: ", existingUser);
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          serviceRequests: {
            connect: [{ id: serviceRequestId }],
          },
        },
      });
      log("updatedUser: ", updatedUser);
    } catch (error) {
      throw new Error("Error creating service request.");
    }
    return Promise.resolve();
  }

  async getServiceRequestByID(requestId: string): Promise<serviceRequest> {
    try {
      const serviceRequest: serviceRequest | null = await prisma.serviceRequest.findUnique(
        {
          where: {
            id: requestId,
          },
        },
      );

      if (!serviceRequest) {
        throw new Error("Service request not found.");
      }

      return serviceRequest;
    } catch (error) {
      throw new Error("Error retrieving service request.");
    }
  }

  async postServiceRequest(inputServiceRequest: any): Promise<serviceRequest> {
    let newServiceRequest: serviceRequest;
    try {
      const requesterId = inputServiceRequest.requesterId;

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
      } else if (
        userExists.role != "ADMIN" ||
        userExists.isAccepted != "ACCEPTED"
      ) {
        throw new Error("Only admins can create service requests.");
      }

      const requestData: Prisma.serviceRequestCreateInput = inputServiceRequest;
      newServiceRequest = await prisma.serviceRequest.create({
        data: requestData,
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
      const deletedServiceRequest: serviceRequest = await prisma.serviceRequest.delete(
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
