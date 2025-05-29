import { Box, Text, Button } from "@chakra-ui/react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export function FinalStep() {
  useEffect(() => {
    confetti({ particleCount: 100, spread: 70 });
  }, []);
  return (
    <Box textAlign="center" py={8}>
      <Text fontSize="2xl" fontWeight="bold">
        All set!
      </Text>
      <Text mt={4}>Your K-Dom will go live once a moderator reviews it.</Text>
      <Button mt={6} colorScheme="purple">
        Go to dashboard
      </Button>
    </Box>
  );
}
