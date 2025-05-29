import { Box, Button, Flex, Link, Stack, Text } from "@chakra-ui/react";

const categories = [
  {
    title: "MUSIC",
    items: ["BTS", "BLACKPINK", "Stray Kids"],
  },
  {
    title: "K-DRAMA",
    items: ["Crash Landing", "Goblin", "Itaewon Class"],
  },
  {
    title: "FASHION",
    items: ["Streetwear", "Minimalist", "Idol Looks"],
  },
  {
    title: "K-FOOD",
    items: ["Kimchi", "Ramyeon", "BBQ"],
  },
];

export function PopularSection() {
  return (
    <Box
      bgGradient="linear(to-b, red.800, pink.100)"
      p={6}
      borderRadius="md"
      mb={10}
      boxShadow="lg"
    >
      <Flex maxW="1400px" mx="auto" align="center" justify="space-between">
        <Stack
          direction="row"
          spacing={8}
          divider={<Box borderRight="1px solid" borderColor="red.700" />}
        >
          <Button
            variant="solid"
            colorScheme="red"
            bg="red.400"
            _hover={{ bg: "red.700" }}
            size="sm"
            borderRadius="md"
          >
            POPULAR K-DOMS
          </Button>

          {categories.map((cat) => (
            <Box key={cat.title}>
              <Text fontWeight="bold" fontSize="sm" mb={2} color="white">
                {cat.title}
              </Text>
              <Stack spacing={1}>
                {cat.items.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    fontSize="sm"
                    color="white"
                    _hover={{ textDecoration: "underline", color: "red.800" }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box maxW="320px" pl={8} color="white" fontSize="sm" mr={4}>
          Find where <strong>music, passion and community</strong> unite
        </Box>

        <Button colorScheme="red" variant="solid" size="sm">
          Explore &rarr;
        </Button>
      </Flex>
    </Box>
  );
}
