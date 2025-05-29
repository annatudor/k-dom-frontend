// pages/StartKDomPage.tsx
import { Box } from "@chakra-ui/react";
import { StartKDomForm } from "@/components/kdom/start-kdom/StartKDomForm";

export default function StartKDomPage() {
  return (
    <Box bg="gray.50" minH="100vh" pt="64px">
      {" "}
      {/* dacă vrei sub navbar */}
      <StartKDomForm />
    </Box>
  );
}
