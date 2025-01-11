export enum ServiceRequestType {
  SITE = "SITE",
  KITCHEN = "KITCHEN",
}

export enum CookingMethod {
  BAKE = "BAKE",
  BOIL = "BOIL",
  FRY = "FRY",
  GRILL = "GRILL",
  ROAST = "ROAST",
  STEAM = "STEAM",
}

export enum Frequency {
  NEVER = "NEVER",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
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
  cookingMethod: CookingMethod | null;
  frequency: Frequency | null;
  currentEmail: string;
  inviteEmails: string[] | null;
  requestType: ServiceRequestType;
  assigneeIds?: string[] | null;
};

export type ServiceRequestErrors = {
  shiftTimeError: string;
  shiftEndTimeError: string;
};

export type CreateShiftFormStepProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => true | void;
  back: () => void;
  updateFields: (fields: Partial<ServiceRequest>) => void;
  data: ServiceRequest;
  errors: Partial<ServiceRequestErrors>;
  updateErrorFields: (fields: Partial<ServiceRequestErrors>) => void;
};

export type CreateShiftFormStepComponentType = React.FunctionComponent<CreateShiftFormStepProps>;
