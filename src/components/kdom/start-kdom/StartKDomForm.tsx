import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Button, Box } from "@chakra-ui/react";

import { StepProgress } from "./StepProgress";
import { KDomNameStep } from "./KDomNameStep";
import { KDomAboutStep } from "./KDomAboutStep";
import { ThemeSelectionStep } from "./ThemeSelectionStep";
import { FinalStep } from "./FinalStep";
import type { Language, Hub, KDomTheme } from "@/types/KDom";
import { useCreateKDom } from "@/hooks/useCreateKDom";
import { useKDomToasts } from "@/utils/toastUtils";
import {
  isStepComplete,
  mapFormDataToCreateDto,
  validateCompleteForm,
} from "@/utils/formValidation";

const MotionBox = motion.create(Box);

// FormData actualizat fără categories
export type FormData = {
  kdomName: string;
  kdomUrl: string;
  language: string;
  description: string;
  hub: string;
  isForChildren: boolean;
  theme: string;
};

export type FieldChange = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;

const STEP_NAMES = [
  "Name your K-Dom",
  "About your K-Dom",
  "Choose theme",
  "All set!",
];

export function StartKDomForm() {
  const [activeStep, setActiveStep] = useState(0);
  const prev = useRef(activeStep);

  useEffect(() => {
    prev.current = activeStep;
  }, [activeStep]);

  const dir = activeStep > prev.current ? 1 : -1;

  const [formData, setFormData] = useState<FormData>({
    kdomName: "",
    kdomUrl: "",
    language: undefined as unknown as Language,
    description: "",
    hub: undefined as unknown as Hub,
    isForChildren: false,
    theme: undefined as unknown as KDomTheme,
  });

  const { showStepIncomplete, showValidationErrors } = useKDomToasts();
  const createKDom = useCreateKDom({
    onSuccess: () => {
      // Navighează la step-ul final
      setActiveStep(3);
    },
  });

  const handleFieldChange: FieldChange = (field, value) => {
    setFormData((f) => ({ ...f, [field]: value }));
  };

  const handleNext = () => {
    const currentStepComplete = isStepComplete(activeStep, formData);

    if (!currentStepComplete) {
      showStepIncomplete(STEP_NAMES[activeStep]);
      return;
    }

    setActiveStep((s) => s + 1);
  };

  const handleBack = () => {
    setActiveStep((s) => s - 1);
  };

  const handleCreateKDom = async () => {
    // Validare finală
    console.log("FormData înainte de mapare:", formData);
    const errors = validateCompleteForm(formData);
    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    // Transformă și trimite datele
    const createDto = mapFormDataToCreateDto(formData);
    console.log("DTO generat:", createDto);
    createKDom.mutate(createDto);
  };

  const steps = [
    <KDomNameStep
      key="name"
      formData={formData}
      onFieldChange={handleFieldChange}
    />,
    <KDomAboutStep
      key="about"
      formData={formData}
      onFieldChange={handleFieldChange}
    />,
    <ThemeSelectionStep
      key="theme"
      formData={formData}
      onFieldChange={handleFieldChange}
    />,
    <FinalStep key="final" />,
  ];

  const isCurrentStepComplete = isStepComplete(activeStep, formData);
  const isLastStep = activeStep === steps.length - 1;
  const isSecondToLastStep = activeStep === steps.length - 2;

  return (
    <Container maxW="container.md" py={8}>
      <StepProgress activeStep={activeStep} />

      <Box pos="relative" h="500px" overflow="hidden">
        <AnimatePresence initial={false} custom={dir}>
          <MotionBox
            key={activeStep}
            custom={dir}
            initial={{ opacity: 0, x: dir * 100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 },
            }}
            exit={{
              opacity: 0,
              x: -dir * 100,
              transition: { duration: 0.3 },
            }}
            pos="absolute"
            top={0}
            left={0}
            w="100%"
          >
            {steps[activeStep]}
          </MotionBox>
        </AnimatePresence>
      </Box>

      {!isLastStep && (
        <Box mt={8} display="flex" justifyContent="space-between">
          <Button
            onClick={handleBack}
            isDisabled={activeStep === 0}
            variant="outline"
          >
            Back
          </Button>

          {isSecondToLastStep ? (
            <Button
              colorScheme="green"
              onClick={handleCreateKDom}
              isLoading={createKDom.isPending}
              loadingText="Creating..."
              isDisabled={!isCurrentStepComplete}
            >
              Create My K-Dom
            </Button>
          ) : (
            <Button
              colorScheme="purple"
              onClick={handleNext}
              isDisabled={!isCurrentStepComplete}
            >
              Next
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}
