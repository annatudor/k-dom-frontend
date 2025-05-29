import { Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={6}>
      <Container maxW="md" bg="white" boxShadow="lg" borderRadius="md" p={8}>
        <Outlet />
      </Container>
    </Flex>
  );
}
