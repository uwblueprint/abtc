import { Prisma, platformSignUp, Status } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/naming-convention
export type postPlatformSignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  status: Status;
  note: string;
};

interface IPlatformSignup {
  /**
   * Gets  signup
   */
  getPlatformSignups(): Promise<platformSignUp[]>;

  /**
   * Posts  signup
   * @param Platform the PlatformSignup to be created
   * @returns a PlatformSignUp with the provided information
   * @throws Error if user creation fails
   */
  postPlatformSignup(
    platform: postPlatformSignupInput,
  ): Promise<platformSignUp>;

  /**
   * Edits  signup
   */
  editPlatformSignup(signupId: string): Promise<void>;

  /**
   * Accepts  signup
   * @param signupRequestId the ID of the Platform to be accepted
   * @throws Error if  acceptnce fails
   */
  acceptById(signupRequestId: string): Promise<void>;
  rejectById(signupRequestId: string): Promise<void>;

}

export default IPlatformSignup;
