import React, { useState } from 'react';
import useMultistepForm from '../../hooks/useMultistepForm';
import SignupMain from './SignupMain';
import SignupSecondary from './SignupSecondary';
import { SignupFormStepComponentType, SignupRequest, SignupRequestErrors } from '../../types/SignupFormStepTypes';
import SignupEmergencyContact from './SignupEmergencyContact';

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

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLastStep) return next();
    // TODO: send POST request to sign up user
    alert("Successful Signup");
    console.log("Signup Info:", data);
    return true;
  }

  return (<>{!!stepExists && !!errorsExists &&
    <StepComponent back={back} onSubmit={onSubmit} updateFields={updateFields} data={data} errors={errors} updateErrorFields={updateErrorFields} />}</>
  );
};

export default Signup;
