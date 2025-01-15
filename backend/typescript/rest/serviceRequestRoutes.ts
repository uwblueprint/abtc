import { Router } from "express";
import IServiceRequest from "../services/interfaces/serviceRequest";
import ServiceRequest from "../services/implementations/serviceRequest";
import { getErrorMessage } from "../utilities/errorUtils";
import { getAccessToken, isAuthorizedByRole} from "../middlewares/auth";
import AuthService from "../services/implementations/authService";
import IAuthService from "../services/interfaces/authService";
import IUserService from "../services/interfaces/userService";
import UserService from "../services/implementations/userService";
import IEmailService from "../services/interfaces/emailService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";

const serviceRequestRouter: Router = Router();
const serviceRequestService: IServiceRequest = new ServiceRequest();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

/* Get service request by ID if requestId is specified; otherwise, return all service requests. */
serviceRequestRouter.get("/", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])),async (req, res) => {
 
  const {requestId, fromDate, toDate} = req.params
  
  if (requestId) {
    if (typeof requestId !== "string") {
      res
        .status(400)
        .json({ error: "requestId query parameter must be a string." });
    } else {
      try {
        const serviceRequest =
          await serviceRequestService.getServiceRequestByID(requestId);
        res.status(200).json(serviceRequest);
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
  } else {
    try {
      let serviceRequests;

      if (fromDate && toDate) {
        const fromDateFormatted = new Date(fromDate as string).toISOString();
        const toDateFormatted = new Date(toDate as string).toISOString();

        if (
          isNaN(new Date(fromDateFormatted).getTime()) ||
          isNaN(new Date(toDateFormatted).getTime())
        ) {
          res
            .status(400)
            .json({
              error:
                "fromDate and toDate query parameters must be valid dates in ISO format.",
            });
          return;
        }

        serviceRequests = await serviceRequestService.getServiceRequests();
        serviceRequests = serviceRequests.filter((request) => {
          const requestDate = request.shiftTime
            ? new Date(request.shiftTime).toISOString()
            : null;
          if (requestDate) {
            return (
              requestDate >= fromDateFormatted && requestDate <= toDateFormatted
            );
          }
          return false;
        });
      } else {
        serviceRequests = await serviceRequestService.getServiceRequests();
      }

      res.status(200).json(serviceRequests);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

/* Get service requests by requester ID */
serviceRequestRouter.get("/requester/:requesterId",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { requesterId } = req.params;

  try {
    const serviceRequests =
      await serviceRequestService.getServiceRequestsByRequesterId(requesterId);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

serviceRequestRouter.get("/id/:requestId",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { requestId } = req.params;
 
  try {
    const serviceRequests =
      await serviceRequestService.getServiceRequestByID(requestId);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post service request by requester ID */
serviceRequestRouter.post("/requester/:requesterId",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { requesterId, } = req.params;
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
serviceRequestRouter.get("/user/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const userId = req.params.id;
  try {
    const serviceRequests =
      await serviceRequestService.getServiceRequestsByUserId(userId);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post service request by user ID */
serviceRequestRouter.post("/user/:userId",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
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

/* Post service request by user ID */
serviceRequestRouter.post("/removeUser/:userId",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { userId } = req.params;
  const { serviceRequestId, shiftName, fullName, shiftDate } = req.body;
  try {
    await serviceRequestService.postRemoveServiceRequestByUserId(
      userId,
      serviceRequestId,
    );

    const emailTitle = `Cancelled shift - ${shiftName}`
    const emailBody = `
      <br><br>
      ${fullName} has withdrawn from a shift scheduled for ${shiftDate}
      <br><br>
      `;
    await emailService.sendEmail("aathithan.chandrabalan.27@gmail.com", emailTitle, emailBody)
    res
      .status(200)
      .json({ message: `Service Request added to user successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


/* Post ServiceRequest route. Requires ADMIN role to perform this action. */
serviceRequestRouter.post("/post",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
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
serviceRequestRouter.delete("/delete/:id", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])),async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log(requestId, "requestId")
    await serviceRequestService.deleteServiceRequestByID(requestId);
    res.status(200).json({ message: `Service Request deleted successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default serviceRequestRouter;
