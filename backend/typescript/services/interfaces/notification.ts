import { Prisma, notification } from "@prisma/client";

interface INotification {
  /**
   * Get serviceRequests by assigneeId
   * @param assigneeId assignee's id
   * @returns an array of notifications
   * @throws Error if notification getting fails
   */
  getNotificationsById(assigneeId: string): Promise<notification[]>;


  /**
   * Add a notification
   * @throws Error if notification addition fails
   */
  postNotification(inputNotfication: any): Promise<notification>;

  updateNotificationChecked(id: string): Promise<notification>;

}

export default INotification;
