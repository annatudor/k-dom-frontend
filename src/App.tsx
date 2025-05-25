import { Box, Flex } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <Box>
      <Navbar />
      <Flex h="calc(100vh - 64px)">
        {" "}
        {/* Navbar are 64px */}
        <Sidebar />
        <Box flex="1" p={6} bg="white" overflowY="auto">
          <Routes>
            <Route path="/" element={<div>Homepage 🏠</div>} />
          </Routes>
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
}
