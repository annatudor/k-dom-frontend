// src/pages/ForgotPassword.tsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { forgotPassword } from "@/api/user"; // ai grijă să ai endpoint-ul în api/user.ts
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast({
        title: "Success",
        description: "If this email exists, a reset link was sent.",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: getAxiosErrorMessage(err),
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        Forgot Password
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          isDisabled={!email}
        >
          Send Reset Link
        </Button>
        <Text fontSize="sm" color="gray.500">
          Remember your password? <a href="/login">Back to login</a>
        </Text>
      </VStack>
    </Box>
  );
}
