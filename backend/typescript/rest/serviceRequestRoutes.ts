import { Router } from "express";
import IServiceRequest from "../services/interfaces/serviceRequest";
import ServiceRequest from "../services/implementations/serviceRequest";
import { getErrorMessage } from "../utilities/errorUtils";
import { isAuthorizedByRole } from "../middlewares/auth";

const serviceRequestRouter: Router = Router();
const serviceRequestService: IServiceRequest = new ServiceRequest();

/* Get service request by ID if requestId is specified; otherwise, return all service requests. */
serviceRequestRouter.get("/", async (req, res) => {
  const { requestId } = req.query;

  if (requestId) {
    if (typeof requestId !== "string") {
      res
        .status(400)
        .json({ error: "requestId query parameter must be a string." });
    } else {
      try {
        const serviceRequest = await serviceRequestService.getServiceRequestByID(
          requestId,
        );
        res.status(200).json(serviceRequest);
      } catch (error: unknown) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
  } else {
    try {
      const serviceRequests = await serviceRequestService.getServiceRequests();
      res.status(200).json(serviceRequests);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

export default serviceRequestRouter;
