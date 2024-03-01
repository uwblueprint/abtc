export type SignupRequest = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    emergencyFirstName: string;
    emergencyLastName: string;
    emergencyPhoneNumber: string;
};

export type SignupRequestErrors = {
    emailError: string;
    phoneNumberError: string;
    passwordError: string;
};

export type SignupFormStepProps = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => true | void;
    back: () => void;
    updateFields: (fields: Partial<SignupRequest>) => void;
    data: SignupRequest;
    errors: Partial<SignupRequestErrors>;
    updateErrorFields: (fields: Partial<SignupRequestErrors>) => void;
};

export type SignupFormStepComponentType = React.FunctionComponent<SignupFormStepProps>;
