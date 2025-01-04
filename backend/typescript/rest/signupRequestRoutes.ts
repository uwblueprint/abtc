/* eslint-disable prettier/prettier */
import { Router } from "express";
import PlatformSignup from "../services/implementations/platformSignup";
import { getErrorMessage } from "../utilities/errorUtils";
import { isAuthorizedByRole } from "../middlewares/auth";
import { Role } from "../types";

const platformSignupRouter: Router = Router();
/* Return all PlatformSignups */
platformSignupRouter.get("/",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const platformSignup = new PlatformSignup();
    const signups = await platformSignup.getPlatformSignups();

    res.status(200).json(signups);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a PlatformSignup given an id */
platformSignupRouter.delete("/delete/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const signupId = req.params.id;

    const platformSignup = new PlatformSignup();
    await platformSignup.acceptById(signupId);

    res.status(200).json({ message: `Platform signup deleted successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Accept a PlatformSignup given an id */
platformSignupRouter.get("/accept/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const signupId = req.params.id;

    const platformSignup = new PlatformSignup();
    await platformSignup.acceptById(signupId);

    res.status(200).json({ message: `Platform signup accepted successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Reject a PlatformSignup given an id */
platformSignupRouter.get("/reject/:id",isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  try {
    const signupId = req.params.id;

    const platformSignup = new PlatformSignup();
    await platformSignup.rejectById(signupId);

    res.status(200).json({ message: `Platform signup rejected successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default platformSignupRouter;
