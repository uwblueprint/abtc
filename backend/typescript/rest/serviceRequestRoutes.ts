import { Router } from "express";
import IServiceRequest from "../services/interfaces/serviceRequest";
import ServiceRequest from "../services/implementations/serviceRequest";
import { getErrorMessage } from "../utilities/errorUtils";
import { Prisma } from '@prisma/client';

const serviceRequestRouter: Router = Router();
const serviceRequestService: IServiceRequest = new ServiceRequest();

/* Get service request by ID if requestId is specified; otherwise, return all service requests. */
serviceRequestRouter.get("/", async (req, res) => {
  const { requestId, fromDate, toDate } = req.body;

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

      let serviceRequests;

      if (fromDate && toDate) {
        const fromDateFormatted = new Date(fromDate as string).toISOString();
        const toDateFormatted = new Date(toDate as string).toISOString();

        if (isNaN(new Date(fromDateFormatted).getTime()) || isNaN(new Date(toDateFormatted).getTime())) {
          res
            .status(400)
            .json({ error: "fromDate and toDate query parameters must be valid dates in ISO format." });
          return;
        }

        serviceRequests = await serviceRequestService.getServiceRequests();
        serviceRequests = serviceRequests.filter(request => {
          const requestDate = request.shiftTime ? new Date(request.shiftTime).toISOString() : null;
          if (requestDate) {
            return requestDate >= fromDateFormatted && requestDate <= toDateFormatted;
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

/* Post ServiceRequest route. Requires ADMIN role to perform this action. */
serviceRequestRouter.post("/post", async (req, res) => {
  try {
    const newServiceRequest = await serviceRequestService.postServiceRequest(req.body);
    res.status(200).json(newServiceRequest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


/* Delete a ServiceRequest given an id */
serviceRequestRouter.delete('/delete/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    await serviceRequestService.deleteServiceRequestByID(requestId);
    res.status(200).json({ message: `Service Request deleted successfully.` });

  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default serviceRequestRouter;
