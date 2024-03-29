import { Router } from "express";
import IServiceRequest from "../services/interfaces/serviceRequest";
import ServiceRequest from "../services/implementations/serviceRequest";
import { getErrorMessage } from "../utilities/errorUtils";
import { getAccessToken } from "../middlewares/auth";
import AuthService from "../services/implementations/authService";
import IAuthService from "../services/interfaces/authService";
import IUserService from "../services/interfaces/userService";
import UserService from "../services/implementations/userService";
import IEmailService from "../services/interfaces/emailService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";
import { log } from "console";

const serviceRequestRouter: Router = Router();
const serviceRequestService: IServiceRequest = new ServiceRequest();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

/* Get service request by ID if requestId is specified; otherwise, return all service requests. */
serviceRequestRouter.get("/", async (req, res) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = await authService.getCurrentUserId(accessToken);
  log(`User ID: ${userId}`);
  try {
    const serviceRequests = await serviceRequestService.getServiceRequestsByUserId(userId);
    log(`Service requests: ${serviceRequests}`);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Get service requests by requester ID */
serviceRequestRouter.get("/requester/:requesterId", async (req, res) => {
  const { requesterId }= req.params;
  try {
    const serviceRequests = await serviceRequestService.getServiceRequestsByRequesterId(
      requesterId,
    );
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post service request by requester ID */
serviceRequestRouter.post("/requester/:requesterId", async (req, res) => {
  const { requesterId } = req.params;
  const { serviceRequestId } = req.body;
  try {
    await serviceRequestService.postServiceRequestByRequesterId(
      requesterId,
      serviceRequestId,
    );
    res
      .status(200)
      .json({ message: `Service Request added to user successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Get service requests by user ID */
serviceRequestRouter.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const serviceRequests = await serviceRequestService.getServiceRequestsByUserId(
      userId,
    );
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post service request by user ID */
serviceRequestRouter.post("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { serviceRequestId } = req.body;
  try {
    await serviceRequestService.postServiceRequestByUserId(
      userId,
      serviceRequestId,
    );
    res
      .status(200)
      .json({ message: `Service Request added to user successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post ServiceRequest route. Requires ADMIN role to perform this action. */
serviceRequestRouter.post("/post", async (req, res) => {
  try {
    const newServiceRequest = await serviceRequestService.postServiceRequest(
      req.body,
    );
    res.status(200).json(newServiceRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a ServiceRequest given an id */
serviceRequestRouter.delete("/delete/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    await serviceRequestService.deleteServiceRequestByID(requestId);
    res.status(200).json({ message: `Service Request deleted successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default serviceRequestRouter;
