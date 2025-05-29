import {
  Stack,
  RadioGroup,
  Radio,
  HStack,
  Box,
  Text,
  FormControl,
  FormErrorMessage,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaPalette, FaMinusSquare } from "react-icons/fa";
import { useThemes } from "@/hooks/useKDomData";
import { validateThemeStep } from "@/utils/formValidation";
import { useKDomToasts } from "@/utils/toastUtils";
import type { FormData, FieldChange } from "./StartKDomForm";
import { useEffect, useState } from "react";

interface Props {
  formData: Pick<FormData, "theme">;
  onFieldChange: FieldChange;
}

// Mapare pentru iconuri și labels
const themeConfig = {
  Light: {
    label: "Light",
    icon: FaSun,
    description: "Clean and bright interface",
  },
  Dark: { label: "Dark", icon: FaMoon, description: "Modern dark theme" },
  Vibrant: {
    label: "Vibrant",
    icon: FaPalette,
    description: "Colorful and energetic",
  },
  Pastel: {
    label: "Cute and friendly",
    icon: FaMinusSquare,
    description: "Simple and elegant",
  },
};

export function ThemeSelectionStep({ formData, onFieldChange }: Props) {
  const {
    data: themes,
    isLoading: themesLoading,
    error: themesError,
  } = useThemes();
  const { showApiError } = useKDomToasts();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validare în timp real
  useEffect(() => {
    const errors = validateThemeStep(formData);
    setValidationErrors(errors);

    console.log("Themes from useThemes:", themes);
  }, [formData, themes]);

  // Handle API errors
  useEffect(() => {
    if (themesError) {
      showApiError("Failed to load themes. Please refresh the page.");
    }
  }, [themesError, showApiError]);

  if (themesLoading) {
    return (
      <Stack spacing={6} align="center">
        <Spinner size="lg" />
        <Text>Loading available themes...</Text>
      </Stack>
    );
  }

  return (
    <Stack spacing={6}>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Choose a theme
        </Text>
        <Text fontSize="sm" color="gray.600">
          Select the visual style for your K-Dom
        </Text>
      </Box>

      <FormControl isInvalid={validationErrors.length > 0}>
        <RadioGroup
          value={formData.theme}
          onChange={(val) => onFieldChange("theme", val)}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {themes?.map((themeValue) => {
              const config =
                themeConfig[themeValue as keyof typeof themeConfig];
              if (!config) return null;

              const Icon = config.icon;
              const isSelected = formData.theme === themeValue;

              return (
                <Box
                  key={themeValue}
                  borderWidth="2px"
                  borderColor={isSelected ? "purple.500" : "gray.200"}
                  borderRadius="lg"
                  p={4}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: "purple.300",
                    transform: "translateY(-2px)",
                  }}
                  onClick={() => onFieldChange("theme", themeValue)}
                >
                  <Radio value={themeValue} size="lg">
                    <HStack spacing={3} align="flex-start">
                      <Box as={Icon} size="20px" color="purple.500" mt={1} />
                      <Box>
                        <Text fontWeight="semibold">{config.label}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {config.description}
                        </Text>
                      </Box>
                    </HStack>
                  </Radio>
                </Box>
              );
            })}
          </SimpleGrid>
        </RadioGroup>

        <FormErrorMessage>{validationErrors[0]}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
