import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { login as apiLogin } from "@/api/user";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { token } = await apiLogin({ identifier, password });
      login({ token }); // folosim contextul
      toast({ title: "Login successful", status: "success", duration: 2000 });
      navigate(from, { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
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
        Sign In
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Email or Username</FormLabel>
          <Input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
        <RouterLink to="/forgot-password">
          <Text
            fontSize="sm"
            color="blue.500"
            cursor="pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot your password?
          </Text>
        </RouterLink>
        <Button
          colorScheme="blue"
          onClick={handleLogin}
          isLoading={loading}
          isDisabled={!identifier || !password}
        >
          Sign In
        </Button>
        <Text fontSize="sm" color="gray.500">
          Don’t have an account? <a href="/register">Sign up</a>
        </Text>
      </VStack>
    </Box>
  );
}
