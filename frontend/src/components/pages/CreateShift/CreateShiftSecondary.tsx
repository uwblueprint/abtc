import React from "react";
import { ModalBody } from "@chakra-ui/react";

import {
  CreateShiftFormStepComponentType,
  CreateShiftFormStepProps,
  ServiceRequestType,
} from "../../../types/ServiceRequestTypes";
import CreateShiftKitchen from "./CreateShiftKitchen";
import CreateShiftSite from "./CreateShiftSite";
import CreateShiftDelivery from "./CreateShiftDelivery";

const CreateShiftSecondary: CreateShiftFormStepComponentType = ({
  back,
  onSubmit,
  updateFields,
  data,
  errors,
  updateErrorFields,
}: CreateShiftFormStepProps): React.ReactElement => {
  const { requestType } = data;

  switch (requestType) {
    case ServiceRequestType.KITCHEN:
      return (
        <CreateShiftKitchen
          back={back}
          onSubmit={onSubmit}
          updateFields={updateFields}
          data={data}
          errors={errors}
          updateErrorFields={updateErrorFields}
        />
      );
    case ServiceRequestType.SITE:
      return (
        <CreateShiftSite
          back={back}
          onSubmit={onSubmit}
          updateFields={updateFields}
          data={data}
          errors={errors}
          updateErrorFields={updateErrorFields}
        />
      );
    case ServiceRequestType.DELIVERY:
      return (
        <CreateShiftDelivery
          back={back}
          onSubmit={onSubmit}
          updateFields={updateFields}
          data={data}
          errors={errors}
          updateErrorFields={updateErrorFields}
        />
      );

    default:
      return <ModalBody>No service request of this type exists.</ModalBody>;
  }
};

export default CreateShiftSecondary;
