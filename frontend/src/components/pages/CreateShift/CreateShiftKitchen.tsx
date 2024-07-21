import React, { useEffect } from 'react';
import { Button, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, } from "@chakra-ui/react";
import { CookingMethod, CreateShiftFormStepComponentType, CreateShiftFormStepProps } from '../../../types/ServiceRequestTypes';
import { titleCase } from '../../../utils/FormatUtils';

const CreateShiftKitchen: CreateShiftFormStepComponentType = ({ back, onSubmit, updateFields, data }: CreateShiftFormStepProps): React.ReactElement => {
    const { location, description, meal, cookingMethod } = data;
    const isButtonDisabled =
        !location ||
        !meal ||
        !cookingMethod;

    useEffect(() => {
        updateFields({
            // Default the cooking method to the first method listed in dropdown
            cookingMethod: CookingMethod.BAKE,
        });
    }, []);

    return <form onSubmit={onSubmit}><ModalBody>
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
        <FormControl mt={6} isRequired>
            <FormLabel>Meal</FormLabel>
            <Input
                placeholder="Enter meal name"
                value={meal ?? ""}
                onChange={event => { updateFields({ meal: event.target.value }); }}
            />
        </FormControl>
        <FormControl mt={6} isRequired>
            <FormLabel>Cooking Method</FormLabel>
            <Select
                value={cookingMethod ? `${titleCase(cookingMethod)}` : ""}
                onChange={event => {
                    const method = event.target.value.toUpperCase();
                    updateFields(
                        {
                            cookingMethod: method as CookingMethod,
                        }
                    );
                }}
            >
                {
                    Object.values(CookingMethod).map((method, index) =>
                        <option key={index}>
                            {titleCase(method)}
                        </option>
                    )
                }
            </Select>
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
    </form>;
};

export default CreateShiftKitchen;
