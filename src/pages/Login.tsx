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
  Divider,
  HStack,
} from "@chakra-ui/react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { login as apiLogin } from "@/api/user";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

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
      login({ token });
      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
      });
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && identifier && password && !loading) {
      handleLogin();
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6} textAlign="center">
        Sign In
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* Google OAuth Button */}
        <GoogleAuthButton variant="signin" size="lg" />

        {/* Separator */}
        <HStack>
          <Divider />
          <Text fontSize="sm" color="gray.500" px={3} whiteSpace="nowrap">
            or continue with email
          </Text>
          <Divider />
        </HStack>

        {/* Traditional Login Form */}
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Email or Username</FormLabel>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email or username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
            />
          </FormControl>

          <Box textAlign="right">
            <Text
              as={RouterLink}
              to="/forgot-password"
              fontSize="sm"
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              Forgot your password?
            </Text>
          </Box>

          <Button
            colorScheme="blue"
            onClick={handleLogin}
            isLoading={loading}
            isDisabled={!identifier || !password}
            size="lg"
            mt={2}
          >
            Sign In
          </Button>
        </VStack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Don't have an account?{" "}
          <Text
            as={RouterLink}
            to="/register"
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: "underline" }}
          >
            Sign up
          </Text>
        </Text>
      </VStack>
    </Box>
  );
}
