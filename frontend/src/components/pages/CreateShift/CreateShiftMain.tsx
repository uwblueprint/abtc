import React from 'react';
import moment from "moment";

import { Button, ModalBody, ModalFooter, Box, FormControl, FormLabel, Input, Flex, Select, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, InputRightElement, InputGroup, FormHelperText, } from "@chakra-ui/react";
import { CreateShiftFormStepComponentType, CreateShiftFormStepProps, Frequency, ServiceRequestType } from '../../../types/ServiceRequestTypes';
import { titleCase } from '../../../utils/FormatUtils';
import EARLIEST_SHIFT_TIME from '../../../constants/ServiceRequestConstants';

const CreateShiftMain: CreateShiftFormStepComponentType = ({ onSubmit, updateFields, updateErrorFields, data, errors }: CreateShiftFormStepProps): React.ReactElement => {
    const { requestName, shiftTime, shiftEndTime, frequency, requestType } = data;
    const { shiftTimeError, shiftEndTimeError } = errors;

    const formatDate = (date: Date) => {
        return moment(date).format("YYYY-MM-DD");
    };
    const formatTime = (date: Date) => {
        return moment(date).format("HH:mm");
    };
    const createDateFromTimeAndDate = (timeStr: string, dateStr: string) => {
        const date = moment(dateStr);
        const time = timeStr.split(':');
        return new Date(
            date.year(), // year
            date.month(), // month
            date.date(), // day
            parseInt(time[0], 10), // hour
            parseInt(time[1], 10), // minute
        );
    };

    const updateShiftTimeErrorFields = (startTime: Date, endTime: Date) => {
        const showError = startTime >= endTime;
        updateErrorFields({
            shiftTimeError: showError ? "Start time should be before end time" : "",
            shiftEndTimeError: showError ? "End time should be after start time" : "",
        });
    };
    const handleShiftDateChange = (value: string) => {
        const newStartTime = createDateFromTimeAndDate(EARLIEST_SHIFT_TIME, value);
        updateFields(
            {
                shiftTime: newStartTime.toISOString(),
            }
        );
        if (shiftEndTime) {
            const endTime = new Date(shiftEndTime);
            const newEndTime = new Date(
                newStartTime.getFullYear(), // year
                newStartTime.getMonth(), // month
                newStartTime.getDate(), // day
                endTime.getHours(), // hour
                endTime.getMinutes(), // minute
            );
            updateFields(
                {
                    shiftEndTime: newEndTime.toISOString(),
                }
            );
            updateShiftTimeErrorFields(newStartTime, newEndTime);
        }
    };
    const handleShiftTimeChange = (value: string) => {
        if (shiftTime) {
            const startTime = createDateFromTimeAndDate(value, shiftTime);
            updateFields(
                {
                    shiftTime: startTime.toISOString(),
                }
            );
            if (shiftEndTime) {
                updateShiftTimeErrorFields(startTime, new Date(shiftEndTime));
            }
        }
    };
    const handleShiftEndTimeChange = (value: string) => {
        if (shiftTime) {
            const endTime = createDateFromTimeAndDate(value, shiftTime);
            updateFields(
                {
                    shiftEndTime: endTime.toISOString(),
                }
            );
            updateShiftTimeErrorFields(new Date(shiftTime), endTime);
        }
    };

    const isButtonDisabled =
        !requestName ||
        !shiftTime ||
        !shiftEndTime ||
        !requestType ||
        !!shiftTimeError ||
        !!shiftEndTimeError;

    return <form onSubmit={onSubmit}>
        <ModalBody>
            <FormControl isRequired>
                <FormLabel>Shift Title</FormLabel>
                <Input
                    placeholder="Enter shift title"
                    value={requestName}
                    onChange={event => { updateFields({ requestName: event.target.value }); }}
                />
            </FormControl>
            <Flex columnGap={3}>
                <Box flex="1.5">
                    <FormControl mt={6} isRequired>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            value={formatDate(new Date(shiftTime!))}
                            onChange={event => handleShiftDateChange(event.target.value)}
                        />
                    </FormControl>
                </Box>
                <Box flex="1">
                    <FormControl mt={6} isRequired>
                        <FormLabel>Start Time</FormLabel>
                        <Input
                            type="time"
                            value={shiftTime ? formatTime(new Date(shiftTime)) : ""}
                            onChange={event => handleShiftTimeChange(event.target.value)}
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
                            onChange={event => handleShiftEndTimeChange(event.target.value)}
                        />
                        {shiftEndTimeError && (
                            <FormHelperText fontSize="12" textAlign="left" color="red.500">
                                {shiftEndTimeError}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Box>
            </Flex>
            <FormControl mt={6} width="50%">
                <FormLabel>Repeat</FormLabel>
                <Select
                    value={frequency ? titleCase(frequency) : ""}
                    onChange={event => {
                        updateFields(
                            {
                                frequency: event.target.value.toUpperCase() as Frequency,
                            }
                        );
                    }}
                >
                    {
                        Object.values(Frequency).map((value, index) =>
                            <option key={index}>
                                {titleCase(value)}
                            </option>
                        )
                    }
                </Select>
            </FormControl>
            <FormControl mt={6}>
                <FormLabel>Invite Others</FormLabel>
                {/* TODO: implement invite others */}
                <InputGroup>
                    <Input
                        placeholder="first.last@gmail.com"
                        value=""
                        onChange={_event => { }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            color="white"
                            background="#28214C"
                            h="1.75rem"
                            w="3.5rem"
                            size="sm"
                            onClick={() => { }}
                        >
                            Add
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Flex columnGap={3}>
                {/* <Box flex="1">
                    <FormControl mt={6} isRequired>
                        <FormLabel>Volunteers Required</FormLabel>
                        TODO: Add numVolunteersRequired to schema.prisma
                        TODO: Determine if we want to set a maximum? Used 10 for now
                        <NumberInput defaultValue={1} max={10} min={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </Box>  */}
                <Box flex="1">
                    <FormControl mt={6} isRequired>
                        <FormLabel>Shift Type</FormLabel>
                        <Select
                            value={requestType ? `${titleCase(requestType)} Shift` : ""}
                            onChange={event => {
                                const type = event.target.value.split(' ')[0].toUpperCase();
                                updateFields(
                                    {
                                        requestType: type as ServiceRequestType,
                                    }
                                );
                            }}
                        >
                            {
                                Object.values(ServiceRequestType).map((type, index) =>
                                    <option key={index}>
                                        {titleCase(type)} Shift
                                    </option>
                                )
                            }
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
    </form>;
};

export default CreateShiftMain;
