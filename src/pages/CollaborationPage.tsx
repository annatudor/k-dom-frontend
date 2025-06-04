// src/pages/CollaborationPage.tsx
import { Box, Container } from "@chakra-ui/react";
import { CollaborationDashboard } from "@/components/collaboration/CollaborationDashboard";

export default function CollaborationPage() {
  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <CollaborationDashboard />
      </Container>
    </Box>
  );
}
