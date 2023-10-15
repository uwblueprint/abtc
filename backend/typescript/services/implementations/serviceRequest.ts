import IServiceRequest from "../interfaces/serviceRequest";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

const Logger = logger(__filename);

class ServiceRequest implements IServiceRequest {

}

export default ServiceRequest;
