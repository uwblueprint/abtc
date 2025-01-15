export enum NotificationType {
  INVITE = "INVITE",
  CANCELLED = "CANCELLED",
  PLATFORM = "PLATFORM",
}

export type Notification = {
  id?: string | null;
  assigneeId: string;
  notificationTitle: string;
  notificationDescription: string | null;
  requesterId: string;
  date?: string | null;
  checked?: boolean | null;
  type: NotificationType;
};
