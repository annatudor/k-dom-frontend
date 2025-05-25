import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

export function SignInDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover isOpen={isOpen} placement="bottom-start">
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </PopoverTrigger>
        <PopoverContent w="250px">
          <PopoverBody>
            <Text fontSize="sm" mb={2}>
              Don’t have an account?
            </Text>
            <Link as={RouterLink} to="/auth/register" color="blue.300">
              Register now
            </Link>
            <Text fontSize="xs" mt={3}>
              Or{" "}
              <Link as={RouterLink} to="/auth/signup" color="blue.300">
                Sign Up
              </Link>
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
