// src/components/layout/LoginDropdown.tsx
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Link,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

export function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover isOpen={isOpen} placement="bottom-end" closeOnBlur={false}>
        <PopoverTrigger>
          <Button
            variant="outline"
            size="sm"
            colorScheme="purple"
            borderWidth="2px"
            _hover={{
              bg: "purple.50",
              borderColor: "purple.300",
            }}
          >
            SIGN IN
          </Button>
        </PopoverTrigger>
        <PopoverContent
          w="280px"
          bg={bgColor}
          border="2px solid"
          borderColor={borderColor}
          boxShadow="xl"
          borderRadius="md"
        >
          <PopoverBody p={4}>
            <VStack spacing={4} align="stretch">
              <Box textAlign="center">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Welcome Back!
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Sign in to access your K-Doms
                </Text>
              </Box>

              <Divider />

              <VStack spacing={3} align="stretch">
                <Button
                  as={RouterLink}
                  to="/login"
                  colorScheme="purple"
                  size="md"
                  w="full"
                >
                  Sign In
                </Button>

                <Text fontSize="sm" textAlign="center" color="gray.500">
                  Don't have an account?
                </Text>

                <Button
                  as={RouterLink}
                  to="/register"
                  variant="outline"
                  colorScheme="purple"
                  size="md"
                  w="full"
                >
                  REGISTER
                </Button>
              </VStack>

              <Divider />

              <VStack spacing={2} align="stretch">
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Need help?
                </Text>
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  fontSize="xs"
                  color="purple.500"
                  textAlign="center"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot Password?
                </Link>
              </VStack>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
