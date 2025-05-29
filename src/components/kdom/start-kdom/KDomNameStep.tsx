import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { FaFont, FaLink, FaGlobe } from "react-icons/fa";
import type { FormData, FieldChange } from "./StartKDomForm";

interface Props {
  formData: Pick<FormData, "kdomName" | "kdomUrl" | "language">;
  onFieldChange: FieldChange;
}

export function KDomNameStep({ formData, onFieldChange }: Props) {
  return (
    <Stack spacing={6}>
      <FormControl>
        <FormLabel>K-Dom Name</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaFont color="gray" />
          </InputLeftElement>
          <Input
            name="kdomName"
            placeholder="Enter your K-Dom name"
            value={formData.kdomName}
            onChange={(e) => onFieldChange("kdomName", e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>K-Dom URL</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaLink color="gray" />
          </InputLeftElement>
          <Input
            name="kdomUrl"
            placeholder="Choose a URL for your K-Dom"
            value={formData.kdomUrl}
            onChange={(e) => onFieldChange("kdomUrl", e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Language</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaGlobe color="gray" />
          </InputLeftElement>
          <Select
            name="language"
            value={formData.language}
            onChange={(e) => onFieldChange("language", e.target.value)}
          >
            <option value="en">English</option>
            <option value="ro">Romanian</option>
          </Select>
        </InputGroup>
      </FormControl>
    </Stack>
  );
}
