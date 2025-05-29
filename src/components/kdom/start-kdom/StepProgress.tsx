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
    <Flex align="center" w="100%" mb={8}>
      {labels.map((label, i) => {
        const Icon = icons[i];
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        const isLast = i === labels.length - 1;

        return (
          <Flex key={i} align="center" flex={isLast ? "0" : "1"}>
            <Flex align="center" minW="fit-content">
              <Box
                p={2}
                borderRadius="full"
                bg={isDone ? "green.500" : isActive ? "purple.500" : "gray.200"}
                color={isDone || isActive ? "white" : "gray.500"}
                minW="40px"
                minH="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon size="16px" />
              </Box>
              <Box ml={3}>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? "bold" : "normal"}
                  color={
                    isDone ? "green.600" : isActive ? "purple.600" : "gray.500"
                  }
                  whiteSpace="nowrap"
                >
                  {label}
                </Text>
              </Box>
            </Flex>

            {!isLast && (
              <Divider
                orientation="horizontal"
                flex="1"
                mx={4}
                borderColor={i < activeStep ? "green.500" : "gray.200"}
                borderWidth="2px"
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}
