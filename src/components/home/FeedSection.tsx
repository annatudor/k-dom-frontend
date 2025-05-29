import {
  Box,
  Heading,
  Button,
  Grid,
  Text,
  Image,
  Flex,
  Card,
} from "@chakra-ui/react";

interface PopularItem {
  name: string;
  wiki?: string;
  img: string;
}

interface NewsItem {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
}

interface FeedSectionProps {
  title: string;
  viewAllUrl: string;
  popularItems: PopularItem[];
  newsItems?: NewsItem[];
}

export function FeedSection({
  title,
  viewAllUrl,
  popularItems,
  newsItems = [],
}: FeedSectionProps) {
  return (
    <Box
      maxW="1400px"
      mx="auto"
      px={{ base: 2, md: 4 }}
      mb={8}
      bgGradient="linear(to-b, gray.300, white)"
      borderRadius="md"
      boxShadow="lg"
    >
      {/* Titlu și View All */}
      <Flex justify="space-between" mb={4} align="center">
        <Heading size="lg">{title}</Heading>
        <Button
          as="a"
          href={viewAllUrl}
          rightIcon={<span>→</span>}
          variant="link"
          colorScheme="yellow"
          fontWeight="semibold"
          textTransform="none"
        >
          View All
        </Button>
      </Flex>

      {/* Grila Popular Items */}
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(8, 1fr)",
        }}
        gap={4}
        mb={6}
      >
        {popularItems.map((item, idx) => (
          <Box
            key={idx}
            bg="white"
            borderRadius="md"
            p={3}
            textAlign="center"
            boxShadow="sm"
            cursor="pointer"
            _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
            transition="all 0.3s ease"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Image
              src={item.img}
              alt={item.name}
              boxSize="80px"
              objectFit="cover"
              borderRadius="full"
              mb={2}
            />
            <Text fontWeight="semibold">{item.name}</Text>
            {item.wiki && (
              <Text fontSize="xs" color="gray.500">
                {item.wiki}
              </Text>
            )}
          </Box>
        ))}
      </Grid>

      {/* Titlu Top News Stories */}
      {newsItems.length > 0 && (
        <Heading size="md" mb={4}>
          Top news stories in {title.toLowerCase()}
        </Heading>
      )}

      {/* Grila Top News */}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {newsItems.map((news) => (
          <Card
            key={news.id}
            borderRadius="md"
            overflow="hidden"
            boxShadow="sm"
            cursor="pointer"
            _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
            transition="all 0.3s ease"
            display="flex"
            flexDirection="column"
          >
            <Image
              src={news.image}
              alt={news.title}
              objectFit="cover"
              height="200px"
              width="100%"
            />
            <Box
              p={4}
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Text
                bg="yellow.600"
                color="white"
                fontWeight="bold"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                w="fit-content"
                mb={2}
                textTransform="uppercase"
              >
                {news.tag}
              </Text>
              <Heading size="md" noOfLines={2}>
                {news.title}
              </Heading>
              <Text fontSize="sm" mt={2} color="gray.600" noOfLines={3}>
                {news.description}
              </Text>
            </Box>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
