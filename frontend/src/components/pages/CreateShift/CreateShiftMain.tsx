import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  ModalBody,
  ModalFooter,
  Box,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Select,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  InputRightElement,
  InputGroup,
  FormHelperText,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import {
  CreateShiftFormStepComponentType,
  CreateShiftFormStepProps,
  Frequency,
  ServiceRequestType,
} from "../../../types/ServiceRequestTypes";
import { titleCase } from "../../../utils/FormatUtils";
import EARLIEST_SHIFT_TIME from "../../../constants/ServiceRequestConstants";
import { validateEmail } from "../../../utils/ValidationUtils";
import UserAPIClient from "../../../APIClients/UserAPIClient";

const CreateShiftMain: CreateShiftFormStepComponentType = ({
  onSubmit,
  updateFields,
  updateErrorFields,
  data,
  errors,
}: CreateShiftFormStepProps): React.ReactElement => {
  const {
    requestName,
    shiftTime,
    shiftEndTime,
    frequency,
    currentEmail,
    inviteEmails,
    requestType,
  } = data;
  const { shiftTimeError, shiftEndTimeError } = errors;
  const toast = useToast();

  const [emailUserMapping, setEmailUserMapping] = useState<
    Record<string, string>
  >({});

  const formatDate = (date: Date) => moment(date).format("YYYY-MM-DD");
  const formatTime = (date: Date) => moment(date).format("HH:mm");

  const createDateFromTimeAndDate = (timeStr: string, dateStr: string) => {
    const date = moment(dateStr);
    const time = timeStr.split(":");
    return new Date(
      date.year(),
      date.month(),
      date.date(),
      parseInt(time[0], 10),
      parseInt(time[1], 10),
    );
  };

  useEffect(() => {
    updateFields({
      numberOfVolunteers: 1,
    });
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const mapping: Record<string, string> = {};
      if (inviteEmails) {
        await Promise.all(
          inviteEmails.map(async (email) => {
            try {
              const user = await UserAPIClient.getUserByEmail(email);
              mapping[email] = user
                ? `${user.firstName} ${user.lastName}`
                : email;
            } catch (error) {
              console.error(`Error fetching user for email ${email}:`, error);
              mapping[email] = email; // Fallback to email on error
            }
          }),
        );
        setEmailUserMapping(mapping);
      }
    };
    if (inviteEmails && inviteEmails.length > 0) {
      fetchUserNames();
    }
  }, [inviteEmails]);

  const updateShiftTimeErrorFields = (startTime: Date, endTime: Date) => {
    const showError = startTime >= endTime;
    updateErrorFields({
      shiftTimeError: showError ? "Start time should be before end time" : "",
      shiftEndTimeError: showError ? "End time should be after start time" : "",
    });
  };

  const handleShiftDateChange = (value: string) => {
    const newStartTime = createDateFromTimeAndDate(EARLIEST_SHIFT_TIME, value);
    updateFields({ shiftTime: newStartTime.toISOString() });

    if (shiftEndTime) {
      const endTime = new Date(shiftEndTime);
      const newEndTime = new Date(
        newStartTime.getFullYear(),
        newStartTime.getMonth(),
        newStartTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
      );
      updateFields({ shiftEndTime: newEndTime.toISOString() });
      updateShiftTimeErrorFields(newStartTime, newEndTime);
    }
  };

  const handleShiftTimeChange = (value: string) => {
    if (shiftTime) {
      const startTime = createDateFromTimeAndDate(value, shiftTime);
      updateFields({ shiftTime: startTime.toISOString() });

      if (shiftEndTime) {
        updateShiftTimeErrorFields(startTime, new Date(shiftEndTime));
      }
    }
  };

  const handleShiftEndTimeChange = (value: string) => {
    if (shiftTime) {
      const endTime = createDateFromTimeAndDate(value, shiftTime);
      updateFields({ shiftEndTime: endTime.toISOString() });
      updateShiftTimeErrorFields(new Date(shiftTime), endTime);
    }
  };

  const handleAddEmail = () => {
    if (currentEmail && currentEmail.trim()) {
      const emailError = validateEmail(currentEmail);
      if (emailError) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          status: "error",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const updatedEmails = [...(inviteEmails ?? []), currentEmail.trim()];
      updateFields({ inviteEmails: updatedEmails, currentEmail: "" });
    }
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = inviteEmails?.filter((_, i) => i !== index);
    updateFields({ inviteEmails: updatedEmails });
  };

  const isButtonDisabled =
    !requestName ||
    !shiftTime ||
    !shiftEndTime ||
    !requestType ||
    !!shiftTimeError ||
    !!shiftEndTimeError;

  return (
    <form onSubmit={onSubmit}>
      <ModalBody>
        <FormControl isRequired>
          <FormLabel>Shift Title</FormLabel>
          <Input
            placeholder="Enter shift title"
            value={requestName}
            onChange={(event) =>
              updateFields({ requestName: event.target.value })
            }
          />
        </FormControl>
        <Flex columnGap={3}>
          <Box flex="1.5">
            <FormControl mt={6} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={shiftTime ? formatDate(new Date(shiftTime)) : ""}
                onChange={(event) => handleShiftDateChange(event.target.value)}
              />
            </FormControl>
          </Box>
          <Box flex="1">
            <FormControl mt={6} isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                value={shiftTime ? formatTime(new Date(shiftTime)) : ""}
                onChange={(event) => handleShiftTimeChange(event.target.value)}
              />
              {shiftTimeError && (
                <FormHelperText fontSize="12" textAlign="left" color="red.500">
                  {shiftTimeError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box flex="1">
            <FormControl mt={6} isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                value={shiftEndTime ? formatTime(new Date(shiftEndTime)) : ""}
                onChange={(event) =>
                  handleShiftEndTimeChange(event.target.value)
                }
              />
              {shiftEndTimeError && (
                <FormHelperText fontSize="12" textAlign="left" color="red.500">
                  {shiftEndTimeError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
        </Flex>
        <FormControl mt={6}>
          <FormLabel>Invite Others</FormLabel>
          <InputGroup>
            <Input
              placeholder="first.last@gmail.com"
              value={currentEmail}
              onChange={(event) =>
                updateFields({ currentEmail: event.target.value })
              }
            />
            <InputRightElement width="4.5rem">
              <Button
                color="white"
                background="#28214C"
                h="1.75rem"
                w="3.5rem"
                size="sm"
                onClick={handleAddEmail}
              >
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
          {inviteEmails && inviteEmails.length > 0 && (
            <Wrap mt={4}>
              {inviteEmails.map((email, index) => (
                <WrapItem key={index}>
                  <Tag size="md" colorScheme="gray" borderRadius="full">
                    <TagLabel>{emailUserMapping[email] || email}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveEmail(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
        </FormControl>
        <Flex columnGap={3}>
          <Box flex="1">
            <FormControl mt={6} isRequired>
              <FormLabel>Volunteers Required</FormLabel>
              <NumberInput
                defaultValue={1}
                max={10}
                min={1}
                onChange={(valueString, valueAsNumber) =>
                  updateFields({ numberOfVolunteers: valueAsNumber })
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Box>
          <Box flex="1">
            <FormControl mt={6} isRequired>
              <FormLabel>Shift Type</FormLabel>
              <Select
                value={requestType ? `${titleCase(requestType)} Shift` : ""}
                onChange={(event) =>
                  updateFields({
                    requestType: event.target.value
                      .split(" ")[0]
                      .toUpperCase() as ServiceRequestType,
                  })
                }
              >
                {Object.values(ServiceRequestType).map((type, index) => (
                  <option key={index}>{titleCase(type)} Shift</option>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button
          w="30%"
          mt={4}
          color="white"
          background="#28214C"
          type="submit"
          isDisabled={isButtonDisabled}
        >
          Next
        </Button>
      </ModalFooter>
    </form>
  );
};

export default CreateShiftMain;
