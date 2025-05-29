// src/components/layout/Layout.tsx
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export function Layout() {
  return (
    <Box>
      <Navbar />
      <Flex h="calc(100vh - 64px)">
        <Sidebar />
        <Box flex="1" p={6} bg="white" overflowY="auto">
          <Outlet />
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
}
