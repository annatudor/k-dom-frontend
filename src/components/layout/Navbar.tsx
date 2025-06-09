import {
  Box,
  Flex,
  Button,
  Image,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginDropdown } from "./LoginDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { AvatarDrawer } from "./AvatarDrawer";
import { GlobalSearchBox } from "@/components/layout/GlobalSearchBox";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const bg = useColorModeValue("white", "gray.900");

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bg}
      py={3}
      px={6}
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between">
        {/* STÂNGA: Logo */}
        <RouterLink to="/">
          <Image src="/logo.svg" alt="K-Dom Logo" height="36px" />
        </RouterLink>

        {/* CENTRU: Global Search */}
        <Box
          flex="1"
          maxW="400px"
          mx="auto"
          px={4}
          display={{ base: "none", md: "block" }}
        >
          <GlobalSearchBox />
        </Box>

        {/* DREAPTA: Butoane */}
        <HStack spacing={4}>
          {!isAuthenticated ? (
            <>
              <RouterLink to="/start-kdom">
                <Button variant="ghost" size="sm">
                  Start a K-Dom
                </Button>
              </RouterLink>
              <LoginDropdown />
            </>
          ) : (
            <>
              <RouterLink to="/start-kdom">
                <Button variant="ghost" size="sm">
                  Start a K-Dom
                </Button>
              </RouterLink>
              <NotificationDropdown />
              <AvatarDrawer />
            </>
          )}
        </HStack>
      </Flex>

      {/* Mobile Search - afișat pe mobile */}
      <Box mt={3} display={{ base: "block", md: "none" }}>
        <GlobalSearchBox />
      </Box>
    </Box>
  );
}
