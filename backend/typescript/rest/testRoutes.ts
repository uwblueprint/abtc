import { Router } from "express";
import IServiceRequest from "../services/interfaces/serviceRequest";
import ServiceRequest from "../services/implementations/serviceRequest";
import { getErrorMessage } from "../utilities/errorUtils";

const testRouter: Router = Router();

const serviceRequestService: IServiceRequest = new ServiceRequest();

testRouter.post("/", async (req, res) => {
  try {
    const newServiceRequest = await serviceRequestService.postServiceRequest({
      requestName: req.body.requestName,
      requester: req.body.requester,
      location: req.body.location,
      requestType: req.body.requestType,
    });

    res.status(201).json(newServiceRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});
