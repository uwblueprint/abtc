export enum ServiceRequestType {
  SITE = "SITE",
  KITCHEN = "KITCHEN",
}

export type ServiceRequest = {
  id: string;
  requestName: string;
  requesterId: string;
  location: string;
  shiftTime: string | null;
  shiftEndTime: string | null;
  description: string | null;
  meal: string | null;
  cookingMethod: string | null;
  frequency: string | null;
  requestType: ServiceRequestType;
};
