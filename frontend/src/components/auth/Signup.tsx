import React, { useState } from 'react';
import useMultistepForm from '../../hooks/useMultistepForm';
import SignupMain from './SignupMain';
import SignupSecondary from './SignupSecondary';
import { SignupFormStepComponentType, SignupRequest, SignupRequestErrors } from '../../types/SignupFormTypes';
import SignupEmergencyContact from './SignupEmergencyContact';
import { register } from '../../APIClients/AuthAPIClient';
import { AuthenticatedUser } from '../../types/AuthTypes';

const INITIAL_DATA: SignupRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  emergencyFirstName: "",
  emergencyLastName: "",
  emergencyPhoneNumber: "",
};
const SignupMainErrors: Partial<SignupRequestErrors> = {};

const SignupSecondaryErrors: Partial<SignupRequestErrors> = {
  emailError: "",
  phoneNumberError: "",
  passwordError: "",
};

const SignupEmergencyContactErrors: Partial<SignupRequestErrors> = {
  phoneNumberError: "",
};

const Signup = (): React.ReactElement => {
  const allErrors = [SignupMainErrors, SignupSecondaryErrors, SignupEmergencyContactErrors];
  const steps: SignupFormStepComponentType[] = [SignupMain, SignupSecondary, SignupEmergencyContact];

  const { StepComponent, currentStepIndex, isFirstStep, isLastStep, back, next } = useMultistepForm(steps);

  const [data, setData] = useState(INITIAL_DATA);
  const [signupErrors, setSignupErrors] = useState(allErrors);

  const errors = signupErrors[currentStepIndex];

  const stepExists = !!StepComponent;
  const errorsExists = !!errors;

  const updateFields = (fields: Partial<SignupRequest>) => {
    setData(prev => {
      return { ...prev, ...fields };
    });
  };

  const updateErrorFields = (fields: Partial<SignupRequestErrors>) => {
    if (!errorsExists) return;
    const newSignupErrors = [...signupErrors];
    newSignupErrors[currentStepIndex] = { ...newSignupErrors[currentStepIndex], ...fields };
    setSignupErrors(newSignupErrors);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLastStep) return next();
    const user: AuthenticatedUser = await register({ ...data });
    if (user) {
      alert("Successful sign up!");
    } else {
      alert("There was an error in sign up");
    }
    return true;
  }

  return (<>{!!stepExists && !!errorsExists &&
    <StepComponent back={back} onSubmit={onSubmit} updateFields={updateFields} data={data} errors={errors} updateErrorFields={updateErrorFields} />}</>
  );
};

export default Signup;
