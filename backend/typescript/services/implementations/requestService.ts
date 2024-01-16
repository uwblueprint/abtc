import IRequestSignup from "../interfaces/requestService";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";


const Logger = logger(__filename);

class RequestSignup implements IRequestSignup {

    async removeRequestSignup(serviceRequestID: string, userID: string): Promise<Prisma.User> {
        try {

            const existingUser = await prisma.user.findUnique({
                where: {
                    id: userID
                },
            })

            if (!existingUser) {
                throw new Error(`User with id ${userID} does not exist`);
            }

            const user = await prisma.user.update({
                where: {
                    id: userID
                },
                data: {
                    serviceRequests: {
                        disconnect: {
                            id: serviceRequestID
                        }
                    }
                }
            });
            return user;

                } catch (error) {
                    Logger.error(`Error removing service request from user's list of service requests: ${getErrorMessage(error)}`);
                    throw error;
                }
    }

   

}

export default RequestSignup;
