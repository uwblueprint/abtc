import { useState } from 'react';

const useMultistepForm = (steps: any[]) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const next = () => {
        setCurrentStepIndex(index => {
            if (index >= steps.length - 1) return index;
            return index + 1;
        });
    };

    const back = () => {
        setCurrentStepIndex(index => {
            if (index <= 0) return index;
            return index - 1;
        });
    };

    const goTo = (index: number) => {
        setCurrentStepIndex(index);
    };

    return {
        currentStepIndex,
        StepComponent: steps[currentStepIndex],
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        goTo,
        back,
        next,
    };
};

export default useMultistepForm;
