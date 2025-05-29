import {
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Select,
  FormErrorMessage,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useHubs } from "@/hooks/useKDomData";
import { validateAboutStep } from "@/utils/formValidation";
import { useKDomToasts } from "@/utils/toastUtils";
import type { FormData, FieldChange } from "./StartKDomForm";
import { useEffect, useState } from "react";

interface Props {
  formData: Pick<FormData, "description" | "hub" | "isForChildren">;
  onFieldChange: FieldChange;
}

export function KDomAboutStep({ formData, onFieldChange }: Props) {
  const { data: hubs, isLoading: hubsLoading, error: hubsError } = useHubs();
  const { showApiError } = useKDomToasts();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validare în timp real
  useEffect(() => {
    const errors = validateAboutStep(formData);
    setValidationErrors(errors);
  }, [formData]);

  // Handle API errors
  useEffect(() => {
    if (hubsError) {
      showApiError("Failed to load hubs. Please refresh the page.");
    }
  }, [hubsError, showApiError]);

  return (
    <Stack spacing={6}>
      <FormControl
        isInvalid={validationErrors.some((err) => err.includes("Description"))}
      >
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          placeholder="Describe your K-Dom (minimum 50 characters)..."
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          minH="120px"
        />
        <Text fontSize="sm" color="gray.500" mt={1}>
          {formData.description.length}/50 characters minimum
        </Text>
        <FormErrorMessage>
          {validationErrors.find((err) => err.includes("Description"))}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={validationErrors.some((err) => err.includes("Hub"))}
      >
        <FormLabel>Hub</FormLabel>
        <Select
          name="hub"
          value={formData.hub}
          onChange={(e) => onFieldChange("hub", e.target.value)}
          disabled={hubsLoading}
        >
          <option value="">Select a hub</option>
          {hubs?.map((hub) => (
            <option key={hub} value={hub}>
              {hub}
            </option>
          ))}
        </Select>
        {hubsLoading && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            <Spinner size="xs" mr={2} />
            Loading hubs...
          </Text>
        )}
        <FormErrorMessage>
          {validationErrors.find((err) => err.includes("Hub"))}
        </FormErrorMessage>
      </FormControl>

      <Checkbox
        isChecked={formData.isForChildren}
        onChange={(e) => onFieldChange("isForChildren", e.target.checked)}
      >
        Directed to children under 13
      </Checkbox>
    </Stack>
  );
}
