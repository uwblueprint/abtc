import React, { useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, ModalBody, ModalFooter } from "@chakra-ui/react";
import { CreateShiftFormStepComponentType, CreateShiftFormStepProps } from '../../../types/ServiceRequestTypes';

const CreateShiftSite: CreateShiftFormStepComponentType = ({ back, onSubmit, updateFields, data }: CreateShiftFormStepProps): React.ReactElement => {
    const { location, description } = data;
    const isButtonDisabled = !location;

    useEffect(() => {
        // Nullify the unrelated fields
        updateFields({
            meal: null,
            cookingMethod: null,
        });
    }, []);

    return <form onSubmit={onSubmit}>
        <ModalBody>
            <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                    value={location ?? ""}
                    onChange={event => { updateFields({ location: event.target.value }); }}
                />
            </FormControl>
            <FormControl mt={6}>
                <FormLabel>Description</FormLabel>
                <Input
                    value={description ?? ""}
                    onChange={event => { updateFields({ description: event.target.value }); }}
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
                disabled={isButtonDisabled}
            >
                Submit
            </Button>
        </ModalFooter>
    </form>;
};

export default CreateShiftSite;
