import { Box, Flex, VStack, Text, Link, Image } from "@chakra-ui/react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export function Footer() {
  return (
    <Box
      bgGradient="linear(to-t, red.800, pink.100)"
      color="white"
      py={12}
      px={0}
      width="100%"
      borderRadius={"10px"}
    >
      <Box maxW="1400px" mx="auto" px={8}>
        <Flex
          wrap="wrap"
          direction={{ base: "column", md: "row" }}
          justify="flex-start"
          align="flex-start"
          gap={{ base: 8, md: 16 }}
        >
          {/* LOGO + FOLLOW US */}
          <VStack align="flex-start" spacing={4} minW="150px">
            <Image src="/logo.svg" alt="K-Dom Logo" h={10} />

            <Box>
              <Text fontWeight="bold" fontSize="sm" mb={2} mt={10}>
                FOLLOW US
              </Text>
              <Flex gap={3}>
                <Link href="#" isExternal aria-label="Facebook">
                  <FaFacebookF />
                </Link>
                <Link href="#" isExternal aria-label="Twitter">
                  <FaTwitter />
                </Link>
                <Link href="#" isExternal aria-label="YouTube">
                  <FaYoutube />
                </Link>
                <Link href="#" isExternal aria-label="Instagram">
                  <FaInstagram />
                </Link>
                <Link href="#" isExternal aria-label="LinkedIn">
                  <FaLinkedinIn />
                </Link>
              </Flex>
            </Box>
          </VStack>

          {/* OVERVIEW */}
          <VStack align="flex-start" spacing={2} ml={{ base: 0, md: 40 }}>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              OVERVIEW
            </Text>
            <Link href="#">What is K-Dom?</Link>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Become a part of the team</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Use</Link>
          </VStack>

          {/* COMMUNITY */}
          <VStack align="flex-start" spacing={2} ml={{ base: 0, md: 20 }}>
            <Text fontWeight="bold" fontSize="sm" mb={1}>
              COMMUNITY
            </Text>
            <Link href="#">Community Central</Link>
            <Link href="#">Support</Link>
            <Link href="#">Help</Link>
          </VStack>
        </Flex>

        {/* COPYRIGHT */}
        <Box mt={10} borderTop="1px solid rgba(255, 255, 255, 0.1)" pt={4}>
          <Text fontSize="sm" color="gray.300">
            © 2025 K-Dom, Inc.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
