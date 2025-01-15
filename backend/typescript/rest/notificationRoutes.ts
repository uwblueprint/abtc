import { Router } from "express";
import INotification from "../services/interfaces/notification";
import Notification from "../services/implementations/notification";
import { getErrorMessage } from "../utilities/errorUtils";
import { getAccessToken, isAuthorizedByRole} from "../middlewares/auth";
import AuthService from "../services/implementations/authService";
import IAuthService from "../services/interfaces/authService";
import IUserService from "../services/interfaces/userService";
import UserService from "../services/implementations/userService";
import IEmailService from "../services/interfaces/emailService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";

const notificationRouter: Router = Router();
const notificationService: INotification = new Notification();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);


/* Get service requests by user ID */
notificationRouter.get("/assignee/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const assigneeId = req.params.id;
  try {
    const serviceRequests =
      await notificationService.getNotificationsById(assigneeId);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

notificationRouter.get("/update/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const notificationId = req.params.id;
  try {
    const serviceRequests =
      await notificationService.updateNotificationChecked(notificationId);
    res.status(200).json(serviceRequests);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Post ServiceRequest route. Requires ADMIN role to perform this action. */
notificationRouter.post("/post",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const newServiceRequest = await notificationService.postNotification(
      req.body,
    );
    res.status(200).json(newServiceRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});




export default notificationRouter;
