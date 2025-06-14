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
  Divider,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register } from "@/api/user";
import { getAxiosErrorMessage } from "@/utils/getAxiosErrorMessage";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({ username, email, password });
      toast({
        title: "Account created",
        description: "You can now log in with your new account.",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && username && email && password && !loading) {
      handleRegister();
    }
  };

  const isFormValid = username && email && password;

  return (
    <Box>
      <Heading size="lg" mb={6} textAlign="center">
        Create Account
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* Google OAuth Button */}
        <GoogleAuthButton variant="signup" size="lg" />

        {/* Separator */}
        <HStack>
          <Divider />
          <Text fontSize="sm" color="gray.500" px={3} whiteSpace="nowrap">
            or sign up with email
          </Text>
          <Divider />
        </HStack>

        {/* Traditional Registration Form */}
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Choose a unique username"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email address"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Create a secure password"
            />
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={handleRegister}
            isLoading={loading}
            isDisabled={!isFormValid}
            size="lg"
            mt={2}
          >
            Create Account
          </Button>
        </VStack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          Already have an account?{" "}
          <Text
            as={RouterLink}
            to="/login"
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: "underline" }}
          >
            Sign in
          </Text>
        </Text>
      </VStack>
    </Box>
  );
}
