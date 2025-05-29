import { Flex, Box, Text, Divider } from "@chakra-ui/react";
import { FaPen, FaInfoCircle, FaPalette, FaCheck } from "react-icons/fa";

const icons = [FaPen, FaInfoCircle, FaPalette, FaCheck];
const labels = [
  "Name your K-Dom",
  "About your K-Dom",
  "Choose theme",
  "All set!",
];

interface StepProgressProps {
  activeStep: number;
}

export function StepProgress({ activeStep }: StepProgressProps) {
  return (
    <Flex align="center" w="100%" mb={6}>
      {labels.map((label, i) => {
        const Icon = icons[i];
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        return (
          <Flex key={i} align="center" flex="1">
            <Box
              p={2}
              borderRadius="full"
              bg={isDone ? "purple.500" : isActive ? "purple.400" : "gray.200"}
              color="white"
            >
              <Icon />
            </Box>
            <Text
              ml={2}
              fontSize="sm"
              fontWeight={isActive ? "bold" : "normal"}
              color={isDone || isActive ? "gray.800" : "gray.500"}
            >
              {label}
            </Text>
            {i < labels.length - 1 && (
              <Divider
                orientation="horizontal"
                flex="1"
                mx={2}
                borderColor={i < activeStep ? "purple.500" : "gray.200"}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}
