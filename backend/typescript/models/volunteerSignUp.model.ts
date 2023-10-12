import mongoose, { Schema, Document } from "mongoose";

import { Status } from "../types";

export interface VolunteerSignUp extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  admin_id: string;
  status: Status;
}

const VolunteerSignUpSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  admin_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "ACCEPTED"],
  },
});

export default mongoose.model<VolunteerSignUp>("VolunteerSignUp", VolunteerSignUpSchema);
