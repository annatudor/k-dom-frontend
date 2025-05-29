import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "@/api/user";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({ username, email, password });
      toast({
        title: "Account created",
        description: "You can now log in.",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: getAxiosErrorMessage(err),
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Sign Up
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleRegister}
          isLoading={loading}
          isDisabled={!username || !email || !password}
        >
          Sign Up
        </Button>
        <Text fontSize="sm" color="gray.500">
          Already have an account? <a href="/login">Log in</a>
        </Text>
      </VStack>
    </Box>
  );
}
