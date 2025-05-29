import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  FormErrorMessage,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaFont, FaLink, FaGlobe } from "react-icons/fa";
import { useLanguages } from "@/hooks/useKDomData";
import { validateNameStep } from "@/utils/formValidation";
import { useKDomToasts } from "@/utils/toastUtils";
import type { FormData, FieldChange } from "./StartKDomForm";
import { useEffect, useState } from "react";

interface Props {
  formData: Pick<FormData, "kdomName" | "kdomUrl" | "language">;
  onFieldChange: FieldChange;
}

export function KDomNameStep({ formData, onFieldChange }: Props) {
  const {
    data: languages,
    isLoading: languagesLoading,
    error: languagesError,
  } = useLanguages();
  const { showApiError } = useKDomToasts();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validare în timp real
  useEffect(() => {
    const errors = validateNameStep(formData);
    setValidationErrors(errors);
  }, [formData]);

  // Handle API errors
  useEffect(() => {
    if (languagesError) {
      showApiError("Failed to load languages. Please refresh the page.");
    }
  }, [languagesError, showApiError]);

  return (
    <Stack spacing={6}>
      <FormControl
        isInvalid={validationErrors.some((err) => err.includes("name"))}
      >
        <FormLabel>K-Dom Name</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaFont color="gray" />
          </InputLeftElement>
          <Input
            name="kdomName"
            placeholder="Enter your K-Dom name (min 3 characters)"
            value={formData.kdomName}
            onChange={(e) => onFieldChange("kdomName", e.target.value)}
          />
        </InputGroup>
        <FormErrorMessage>
          {validationErrors.find((err) => err.includes("name"))}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={validationErrors.some((err) => err.includes("URL"))}
      >
        <FormLabel>K-Dom URL</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaLink color="gray" />
          </InputLeftElement>
          <Input
            name="kdomUrl"
            placeholder="Choose a URL for your K-Dom (min 3 characters)"
            value={formData.kdomUrl}
            onChange={(e) => onFieldChange("kdomUrl", e.target.value)}
          />
        </InputGroup>
        <FormErrorMessage>
          {validationErrors.find((err) => err.includes("URL"))}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={validationErrors.some((err) => err.includes("Language"))}
      >
        <FormLabel>Language</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaGlobe color="gray" />
          </InputLeftElement>
          <Select
            name="language"
            value={formData.language}
            onChange={(e) => onFieldChange("language", e.target.value)}
            disabled={languagesLoading}
          >
            <option value="">Select a language</option>
            {languages?.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "En"
                  ? "English"
                  : lang === "Ro"
                  ? "Romanian"
                  : lang === "Kr"
                  ? "Korean"
                  : lang === "Jp"
                  ? "Japanese"
                  : lang === "Fr"
                  ? "French"
                  : lang === "De"
                  ? "Deutsch"
                  : lang}
              </option>
            ))}
          </Select>
        </InputGroup>
        {languagesLoading && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            <Spinner size="xs" mr={2} />
            Loading languages...
          </Text>
        )}
        <FormErrorMessage>
          {validationErrors.find((err) => err.includes("Language"))}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
