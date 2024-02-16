import { Router } from "express";

const platformSignupRouter: Router = Router();
import { isAuthorizedByRole } from "../middlewares/auth";
import PlatformSignup from "../services/implementations/platformSignup";
import IPlatformSignup from "../services/interfaces/platformSignup";
import { getErrorMessage } from "../utilities/errorUtils";


platformSignupRouter.get('/getPlatformSignup', isAuthorizedByRole(new Set(["ADMIN"])), async (req, res) => {
    try {
        const platformSignup = new PlatformSignup();
        const signups = await platformSignup.getPlatformSignups();
  
        res.status(200).json(signups);
    } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});

platformSignupRouter.delete('/deletePlatformSignup/:id', isAuthorizedByRole(new Set(["ADMIN"])), async (req, res) => {
    const signupId = req.params.id;
    
    const platformSignup = new PlatformSignup();
    await platformSignup.editPlatformSignup(signupId);
});
