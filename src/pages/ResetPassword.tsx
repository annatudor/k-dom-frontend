import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/user";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      toast({
        title: "Password reset successful",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Reset failed",
        description: getAxiosErrorMessage(err),
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <Heading mb={6} size="lg">
        Reset Password
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Token</FormLabel>
          <Input value={token} onChange={(e) => setToken(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleReset}
          isLoading={loading}
          isDisabled={!token || !newPassword}
        >
          Reset Password
        </Button>
      </VStack>
    </Box>
  );
}
