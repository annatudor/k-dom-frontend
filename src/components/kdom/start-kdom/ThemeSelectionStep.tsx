import { Stack, RadioGroup, Radio, HStack, Box, Text } from "@chakra-ui/react";
import { FaSun, FaMoon, FaPalette } from "react-icons/fa";
import type { FormData, FieldChange } from "./StartKDomForm";

interface Props {
  formData: Pick<FormData, "theme">;
  onFieldChange: FieldChange;
}

const options = [
  { value: "light", label: "Light", icon: FaSun },
  { value: "dark", label: "Dark", icon: FaMoon },
  { value: "vibrant", label: "Vibrant", icon: FaPalette },
];

export function ThemeSelectionStep({ formData, onFieldChange }: Props) {
  return (
    <Stack spacing={6}>
      <Text fontSize="xl" fontWeight="bold">
        Choose a theme
      </Text>
      <RadioGroup
        value={formData.theme}
        onChange={(val) => onFieldChange("theme", val)}
      >
        <HStack spacing={8}>
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Radio key={opt.value} value={opt.value}>
                <HStack>
                  <Box as={Icon} />
                  <Text>{opt.label}</Text>
                </HStack>
              </Radio>
            );
          })}
        </HStack>
      </RadioGroup>
    </Stack>
  );
}
