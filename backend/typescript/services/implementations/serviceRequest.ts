import { Prisma, serviceRequest, user } from "@prisma/client";
import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";

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

  async getServiceRequestsByRequesterId(
    requesterId: string,
  ): Promise<serviceRequest[]> {
    try {
      const user = (await prisma.user.findUnique({
        where: {
          id: requesterId,
        },
        include: {
          requestedServiceRequests: true,
        },
      })) as user & { requestedServiceRequests: serviceRequest[] };
      return user.requestedServiceRequests;
    } catch (error) {
      throw new Error("Error retrieving service requests.");
    }
  }

  async postServiceRequestByRequesterId(
    requesterId: string,
    serviceRequestId: string,
  ): Promise<serviceRequest> {
    let newServiceRequest: serviceRequest;
    try {
      const userExists = await prisma.user.findUnique({
        where: {
          id: requesterId,
        },
      });

      if (!userExists) {
        throw new Error("Only existing users can create service requests.");
      }

      const newServiceRequest = await prisma.serviceRequest.findUnique({
        where: {
          id: serviceRequestId,
        },
      });

      if (!newServiceRequest) {
        throw new Error("Service request not found.");
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: requesterId,
        },
        data: {
          requestedServiceRequests: {
            connect: [{ id: serviceRequestId }],
          },
        },
        include: {
          requestedServiceRequests: true,
        },
      });
      return newServiceRequest;
    } catch (error) {
      Logger.error(
        `Failed to create service request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getServiceRequestsByUserId(userId: string): Promise<serviceRequest[]> {
    try {
      const userWithAssignedRequests = (await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          assignedServiceRequests: true,
        },
      })) as user & { assignedServiceRequests: serviceRequest[] };

      if (!userWithAssignedRequests) {
        throw new Error("User not found.");
      }

      return userWithAssignedRequests.assignedServiceRequests;
    } catch (error) {
      throw new Error("Error retrieving service requests.");
    }
  }

  async postServiceRequestByUserId(
  userId: string,
  serviceRequestId: string
): Promise<void> {
  try {
    // Find the service request by ID
    const newServiceRequest = await prisma.serviceRequest.findUnique({
      where: {
        id: serviceRequestId,
      },
    });

    if (!newServiceRequest) {
      throw new Error("Service request not found.");
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    // Append the userId to the assigneeIds array in the service request
    await prisma.serviceRequest.update({
      where: {
        id: serviceRequestId,
      },
      data: {
        assigneeIds: {
          set: [
            ...(newServiceRequest.assigneeIds || []), // Keep existing IDs
            userId, // Add the new userId
          ],
        },
      },
    });

    // Update the user's assignedServiceRequests (optional, if necessary)
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        assignedServiceRequests: {
          connect: [{ id: serviceRequestId }],
        },
      },
    });

    return Promise.resolve();
  } catch (error) {
    console.error("Error creating service request:", error);
    throw new Error("Error creating service request.");
  }
}

async postRemoveServiceRequestByUserId(
  userId: string,
  serviceRequestId: string
): Promise<void> {
  try {
    // Find the service request by ID
    const existingServiceRequest = await prisma.serviceRequest.findUnique({
      where: {
        id: serviceRequestId,
      },
    });

    if (!existingServiceRequest) {
      throw new Error("Service request not found.");
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new Error("User not found.");
    }

    // Remove the userId from the assigneeIds array in the service request
    await prisma.serviceRequest.update({
      where: {
        id: serviceRequestId,
      },
      data: {
        assigneeIds: {
          set: (existingServiceRequest.assigneeIds || []).filter(
            (id) => id !== userId // Filter out the userId
          ),
        },
      },
    });

    // Disconnect the serviceRequestId from the user's assignedServiceRequests
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        assignedServiceRequests: {
          disconnect: [{ id: serviceRequestId }], // Disconnect the service request
        },
      },
    });

    return Promise.resolve();
  } catch (error) {
    console.error("Error removing service request:", error);
    throw new Error("Error removing service request.");
  }
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
      const { requesterId } = inputServiceRequest;

      if (!requesterId) {
        throw new Error("No requester ID.");
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

      const requestData: Prisma.serviceRequestCreateInput = {
        ...inputServiceRequest,
        createdAt: new Date().toISOString(),
      };
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
