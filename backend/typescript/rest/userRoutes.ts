import { Router } from "express";
import { Status } from "@prisma/client";

import { isAuthorizedByRole } from "../middlewares/auth";
import {
  createUserDtoValidator,
  updateUserDtoValidator,
} from "../middlewares/validators/userValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import { UserDTO } from "../types";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const userRouter: Router = Router();
userRouter.use(isAuthorizedByRole(new Set(["ADMIN"])));

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

/* Get all users, optionally filter by a userId or email query parameter to retrieve a single user */
userRouter.get("/",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { userId, email } = req.query;
  const contentType = req.headers["content-type"];

  if (userId && email) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by both userId and email.",
      },
    ]);
    return;
  }

  if (!userId && !email) {
    try {
      const users = await userService.getUsers();
      await sendResponseByMimeType<UserDTO>(res, 200, contentType, users);
    } catch (error: unknown) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: getErrorMessage(error),
        },
      ]);
    }
    return;
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string." });
    } else {
      try {
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
    return;
  }

  if (email) {
    if (typeof email !== "string") {
      res.status(400).json({ error: "email query parameter must be a string." });
    } else {
      try {
        // Replace spaces with '+'
        const sanitizedEmail = email.replace(/\s+/g, "+");

        const user = await userService.getUserByEmail(sanitizedEmail);
        res.status(200).json(user);
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
  }
});

/* Create a user */
userRouter.post("/", createUserDtoValidator,isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const newUser = await userService.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      emergencyFirstName: req.body.emergencyFirstName,
      emergencyLastName: req.body.emergencyLastName,
      emergencyPhoneNumber: req.body.emergencyPhoneNumber,
      role: req.body.role,
      password: req.body.password,
    });

    // await authService.sendEmailVerificationLink(req.body.email);
    

    res.status(201).json(newUser);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Update the user with the specified userId */
userRouter.put("/:userId", updateUserDtoValidator,isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.userId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      emergencyFirstName: req.body.emergencyFirstName,
      emergencyLastName: req.body.emergencyLastName,
      emergencyPhoneNumber: req.body.emergencyPhoneNumber,
      role: req.body.role,
    });
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


userRouter.get("/accept",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const { email } = req.query;
    
    if (email){
      if (typeof email !== "string") {
        res.status(400).json({ error: "email query parameter must be a string." });
      } else {
        const decodedEmail = decodeURI(email)
        const user = await userService.getUserByEmail(decodedEmail);
        const userId = user.id
        const updatedUser = await userService.acceptUserById(userId);
        res.status(200).json(updatedUser);
      }
    } else{
      res.status(400).json({ error: "Must supply email as query parameter." });
    }
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a user by userId or email, specified through a query parameter */
userRouter.delete("/",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { userId, email } = req.query;

  if (userId && email) {
    res.status(400).json({ error: "Cannot delete by both userId and email." });
    return;
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string." });
    } else {
      try {
        await userService.deleteUserById(userId);
        res.status(204).send();
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
    return;
  }

  if (email) {
    if (typeof email !== "string") {
      res
        .status(400)
        .json({ error: "email query parameter must be a string." });
    } else {
      try {
        await userService.deleteUserByEmail(email);
        res.status(204).send();
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
    return;
  }

  res
    .status(400)
    .json({ error: "Must supply one of userId or email as query parameter." });
});

export default userRouter;
