import {
  Box,
  Flex,
  // Image,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
// import logo from "../../assets/logo.png"; // ajustează calea

export function HomeHeader() {
  const bg = useColorModeValue("white", "gray.900");

  return (
    <Flex
      as="header"
      align="center"
      justify="center"
      bg={bg}
      px={{ base: 4, md: 8 }}
      py={6}
      boxShadow="sm"
      top={0}
      zIndex={100}
    >
      {/* Logo stânga */}
      <Box position="absolute" left={{ base: 4, md: 8 }}>
        <RouterLink to="/">
          {/* <Image src={logo} alt="K-Dom Logo" height="40px" /> */}
        </RouterLink>
      </Box>

      {/* Searchbar centrat */}
      <Box maxW="600px" w="full" px={{ base: 4, md: 0 }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Search the world's largest fan wiki platform"
            borderRadius="full"
            bg={useColorModeValue("gray.100", "gray.700")}
            _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
            _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
          />
        </InputGroup>
      </Box>
    </Flex>
  );
}
