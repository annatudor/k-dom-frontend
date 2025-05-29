import {
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import type { FormData, FieldChange } from "./StartKDomForm";

interface Props {
  formData: Pick<
    FormData,
    "description" | "hub" | "isForChildren" | "categories"
  >;
  onFieldChange: FieldChange;
}

export function KDomAboutStep({ formData, onFieldChange }: Props) {
  return (
    <Stack spacing={6}>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          placeholder="Describe your K-Dom..."
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Hub</FormLabel>
        <Select
          name="hub"
          value={formData.hub}
          onChange={(e) => onFieldChange("hub", e.target.value)}
        >
          <option value="">Select a hub</option>
          <option value="Music">Music</option>
          <option value="TV">TV & K-Drama</option>
          <option value="Books">Books</option>
          <option value="Comics">Comics</option>
        </Select>
      </FormControl>

      <Checkbox
        isChecked={formData.isForChildren}
        onChange={(e) => onFieldChange("isForChildren", e.target.checked)}
      >
        Directed to children under 13
      </Checkbox>

      <FormControl>
        <FormLabel>Categories</FormLabel>
        <Stack direction="row" wrap="wrap" spacing={4}>
          {["Music", "TV", "Books", "Comics"].map((cat) => {
            const selected = formData.categories.includes(cat);
            return (
              <Checkbox
                key={cat}
                isChecked={selected}
                onChange={() => {
                  const newCats = selected
                    ? formData.categories.filter((c) => c !== cat)
                    : [...formData.categories, cat];
                  onFieldChange("categories", newCats);
                }}
              >
                {cat}
              </Checkbox>
            );
          })}
        </Stack>
      </FormControl>
    </Stack>
  );
}
