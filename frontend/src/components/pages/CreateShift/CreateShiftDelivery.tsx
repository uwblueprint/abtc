import React, { useEffect } from "react";
import {
  Button,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import {
  CookingMethod,
  CreateShiftFormStepComponentType,
  CreateShiftFormStepProps,
} from "../../../types/ServiceRequestTypes";
import { titleCase } from "../../../utils/FormatUtils";

const CreateShiftDelivery: CreateShiftFormStepComponentType = ({
  back,
  onSubmit,
  updateFields,
  data,
}: CreateShiftFormStepProps): React.ReactElement => {
  const { location, description, pickUpLocation, dropOffLocation } = data;
  const isButtonDisabled = !location || !pickUpLocation || !dropOffLocation;

  useEffect(() => {
    updateFields({
      // Default the cooking method to the first method listed in dropdown
      cookingMethod: CookingMethod.BAKE,
    });
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <ModalBody>
        <FormControl isRequired>
          <FormLabel>Location</FormLabel>
          <Input
            value={location ?? ""}
            onChange={(event) => {
              updateFields({ location: event.target.value });
            }}
          />
        </FormControl>
        <FormControl mt={6}>
          <FormLabel>Description</FormLabel>
          <Input
            value={description ?? ""}
            onChange={(event) => {
              updateFields({ description: event.target.value });
            }}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <FormLabel>Pick Up Location</FormLabel>
          <Input
            placeholder="Enter pick up location"
            value={pickUpLocation ?? ""}
            onChange={(event) => {
              updateFields({ pickUpLocation: event.target.value });
            }}
          />
        </FormControl>
        <FormControl mt={6} isRequired>
          <FormLabel>Drop Off Location</FormLabel>
          <Input
            placeholder="Enter drop off location"
            value={dropOffLocation ?? ""}
            onChange={(event) => {
              updateFields({ dropOffLocation: event.target.value });
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter mt={4} mb={4} justifyContent="space-between">
        <Button
          mt={4}
          mr={4}
          w="30%"
          color="white"
          background="#28214C"
          onClick={back}
        >
          Back
        </Button>
        <Button
          w="30%"
          mt={4}
          color="white"
          background="#28214C"
          type="submit"
          isDisabled={isButtonDisabled}
        >
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
};

export default CreateShiftDelivery;
