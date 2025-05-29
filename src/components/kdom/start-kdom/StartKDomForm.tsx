import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Button, Box } from "@chakra-ui/react";

import { StepProgress } from "./StepProgress";
import { KDomNameStep } from "./KDomNameStep";
import { KDomAboutStep } from "./KDomAboutStep";
import { ThemeSelectionStep } from "./ThemeSelectionStep";
import { FinalStep } from "./FinalStep";

const MotionBox = motion.create(Box);

export type FormData = {
  kdomName: string;
  kdomUrl: string;
  language: string;
  description: string;
  hub: string;
  isForChildren: boolean;
  categories: string[];
  theme: string;
};

export type FieldChange = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;

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
    language: "en",
    description: "",
    hub: "",
    isForChildren: false,
    categories: [],
    theme: "",
  });

  const handleFieldChange: FieldChange = (field, value) => {
    setFormData((f) => ({ ...f, [field]: value }));
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

  return (
    <Container maxW="container.md" py={8}>
      <StepProgress activeStep={activeStep} />

      <Box pos="relative" h="400px" overflow="hidden">
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

      <Box mt={8} display="flex" justifyContent="space-between">
        <Button
          onClick={() => setActiveStep((s) => s - 1)}
          isDisabled={activeStep === 0}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button
            colorScheme="purple"
            onClick={() => setActiveStep((s) => s + 1)}
          >
            Next
          </Button>
        ) : (
          <Button colorScheme="green">Create My K-Dom</Button>
        )}
      </Box>
    </Container>
  );
}
