import { volunteerPlatformSignUp } from "@prisma/client";
import IVolunteerSignup from "../interfaces/volunteerSignup";

class VolunteerSignup implements IVolunteerSignup {

  async getVolunteerSignup(id: string): Promise<volunteerPlatformSignUp> {}

  async postVolunteerSignup(): Promise<void> {}

  async editVolunteerSignup(): Promise<void> {}
}

export default VolunteerSignup;
