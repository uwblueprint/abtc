import { Prisma, notification, user } from "@prisma/client";

import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import prisma from "../../prisma";
import INotification from "../interfaces/notification";

const Logger = logger(__filename);

class Notification implements INotification {
  /* eslint-disable class-methods-use-this */

  async getNotificationsById(assigneeId: string): Promise<notification[]> {
    try {
      const notifications: notification[] = await prisma.notification.findMany({
      where: {
        assigneeId: assigneeId,
      },
    });
      if (notifications.length === 0) {
        throw new Error("Notifications not found.");
      }
      return notifications;
    } catch (error) {
      throw new Error("Error retrieving notificationss.");
    }
  }
  

  async postNotification(inputNotification: any): Promise<notification> {
    let newNotification: notification;
    
    try {
      const { assigneeId } = inputNotification;

      if (!assigneeId) {
        throw new Error("No requester ID.");
      }

      const userExists = await prisma.user.findUnique({
        where: {
          id: assigneeId,
        },
      });

      if (!userExists) {
        throw new Error("Only existing users can create notification.");
      } else if (
        userExists.isAccepted != "ACCEPTED"
      ) {
        throw new Error("Only admins can create notifications.");
      }

      const requestData: Prisma.notificationCreateInput = {
        ...inputNotification,
        date: new Date().toISOString(),
        checked: false,
      };
      newNotification = await prisma.notification.create({
        data: requestData,
      });
    } catch (error) {
      Logger.error(
        `Failed to create notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return newNotification;
  } 

  async updateNotificationChecked(notificationId: string): Promise<notification> {
  try {
    // Find the notification to ensure it exists
    const existingNotification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!existingNotification) {
      throw new Error("Notification not found.");
    }

    // Update the `checked` field to `true`
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        checked: true,
      },
    });

    return updatedNotification;
  } catch (error) {
    Logger.error(
      `Failed to update notification. Reason = ${getErrorMessage(error)}`,
    );
    throw error;
  }
}
}



export default Notification;
