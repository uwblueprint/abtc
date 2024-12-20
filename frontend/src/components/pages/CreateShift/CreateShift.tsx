import React, { useContext, useRef, useState } from 'react';
import { Box, Button, Flex, Heading, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack, useDisclosure } from '@chakra-ui/react';
import { CreateShiftFormStepComponentType, Frequency, ServiceRequest, ServiceRequestErrors, ServiceRequestType } from '../../../types/ServiceRequestTypes';
import CreateShiftMain from './CreateShiftMain';
import ServiceRequestAPIClient from '../../../APIClients/ServiceRequestAPIClient';
import useMultistepForm from '../../../hooks/useMultistepForm';
import AuthContext from '../../../contexts/AuthContext';
import CreateShiftSecondary from './CreateShiftSecondary';

const INITIAL_DATA: ServiceRequest = {
    id: "", // will be auto-generated by the database when the request is saved
    requestName: "",
    requesterId: "", // id of the current user will be passed when sending the request
    location: "",
    shiftTime: new Date().toISOString(),
    shiftEndTime: null,
    description: null,
    meal: null,
    cookingMethod: null,
    frequency: Frequency.NEVER,
    currentEmail: "",
    inviteEmails: [],
    requestType: ServiceRequestType.KITCHEN,
};
const CreateShiftMainErrors: Partial<ServiceRequestErrors> = {};

const CreateShiftKitchenErrors: Partial<ServiceRequestErrors> = {};

const ProgressSegment = ({ completed }: { completed: boolean; }): React.ReactElement => {
    return <Box
        background={completed ? "#28214C" : "#D9D7E3"}
        borderRadius="lg"
        flex="1"
        height="0.4em"
    />;
};

const CreateShift = (): React.ReactElement => {
    const { authenticatedUser } = useContext(AuthContext);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);

    const allErrors = [CreateShiftMainErrors, CreateShiftKitchenErrors,];
    const steps: CreateShiftFormStepComponentType[] = [CreateShiftMain, CreateShiftSecondary];

    const { StepComponent, currentStepIndex, isLastStep, back, next } = useMultistepForm(steps);

    const [data, setData] = useState(INITIAL_DATA);
    const [createShiftErrors, setCreateShiftErrors] = useState(allErrors);

    const errors = createShiftErrors[currentStepIndex];

    const stepExists = !!StepComponent;
    const errorsExists = !!errors;

    const updateFields = (fields: Partial<ServiceRequest>) => {
        setData((prev: ServiceRequest) => {
            return { ...prev, ...fields };
        });
    };

    const updateErrorFields = (fields: Partial<ServiceRequest>) => {
        if (!errorsExists) return;
        const newCreateShiftErrors = [...createShiftErrors];
        newCreateShiftErrors[currentStepIndex] = { ...newCreateShiftErrors[currentStepIndex], ...fields };
        setCreateShiftErrors(newCreateShiftErrors);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!isLastStep) return next();
        const request: ServiceRequest | null = await ServiceRequestAPIClient.post({
            ...data,
            requesterId: authenticatedUser!.id,
        });
        if (request) {
            alert("Successfully created!");
            // Close the modal if the request was successfully created
            onClose();
        } else {
            alert("There was an error in creating the request");
            // Keep the modal open to allow user to try creating again
        }
        return true;
    }

    return (
        <>
            <Button ref={btnRef} onClick={onOpen}>
                Create New Shift
            </Button>
            {!!stepExists && !!errorsExists &&
                <Modal
                    onClose={onClose}
                    finalFocusRef={btnRef}
                    isOpen={isOpen}
                    scrollBehavior="outside"
                    size="2xl"
                >
                    <ModalOverlay />
                    <ModalContent
                        pt={10}
                        pr={5}
                        pl={5}
                        pb={10}
                        rounded={20}>
                        <ModalHeader pb={5}>
                            <VStack alignItems="left">
                                <Heading pb={2} size="md">Create New Shift</Heading>
                                <Flex columnGap={4}>
                                    {steps.map((_step, index) =>
                                        <ProgressSegment
                                            key={index}
                                            completed={index <= currentStepIndex}
                                        />
                                    )}
                                </Flex>
                            </VStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <StepComponent
                            back={back}
                            onSubmit={onSubmit}
                            updateFields={updateFields}
                            data={data}
                            errors={errors}
                            updateErrorFields={updateErrorFields}
                        />
                    </ModalContent>
                </Modal>}
        </>
    );
};

export default CreateShift;
