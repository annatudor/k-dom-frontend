import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Heading, Button, Badge, Flex } from "@chakra-ui/react";

const articles = [
  {
    title: "News aespa's Karina revealed she suffered a corneal injury...",
    image:
      "https://www.allkpop.com/upload/2025/04/content/040656/1743764173-2025-04-04-11.png",
    category: "News",
  },
  {
    title: "Xikers drops explosive MV for New Track ‘BREATHE’",
    image:
      "https://i.ytimg.com/vi/aUMr0Oi1I-E/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBmn7rREEqJMxtnmRROhSs6qTxNWw",
    category: "Music Video",
  },
  {
    title: "Netflix Reveals Steamy K-Drama Adaptation of ‘Dangerous Liaisons’",
    image:
      "https://www.hollywoodreporter.com/wp-content/uploads/2025/03/Korean-Trio.jpg?w=1296&h=730&crop=1&resize=450%2C253",
    category: "K-Drama",
  },
  {
    title: "Netflix Reveals Steamy K-Drama Adaptation of ‘Dangerous Liaisons’",
    image:
      "https://www.hollywoodreporter.com/wp-content/uploads/2025/03/Korean-Trio.jpg?w=1296&h=730&crop=1&resize=450%2C253",
    category: "K-Drama",
  },
  {
    title: "Netflix Reveals Steamy K-Drama Adaptation of ‘Dangerous Liaisons’",
    image:
      "https://www.hollywoodreporter.com/wp-content/uploads/2025/03/Korean-Trio.jpg?w=1296&h=730&crop=1&resize=450%2C253",
    category: "K-Drama",
  },
  {
    title: "Netflix Reveals Steamy K-Drama Adaptation of ‘Dangerous Liaisons’",
    image:
      "https://www.hollywoodreporter.com/wp-content/uploads/2025/03/Korean-Trio.jpg?w=1296&h=730&crop=1&resize=450%2C253",
    category: "K-Drama",
  },
];

export function FeedHeader() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000); // schimbă intervalul în ms după preferințe

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <Box
      overflow="hidden"
      ref={emblaRef}
      bgGradient="linear(to-t, red.800, white)"
      borderRadius="md"
      p={4}
      mb={10}
    >
      <Flex gap={6}>
        {articles.map(({ title, image, category }, i) => (
          <Box
            key={i}
            minW="300px"
            borderRadius="md"
            bg="white"
            boxShadow="md"
            overflow="hidden"
            cursor="pointer"
            _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
            transition="all 0.3s ease"
            display="flex"
            flexDirection="column"
          >
            <Box
              as="img"
              src={image}
              alt={title}
              objectFit="cover"
              height="180px"
              width="100%"
            />
            <Box
              p={4}
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Badge
                colorScheme="yellow"
                alignSelf="flex-start"
                mb={2}
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="xs"
              >
                {category}
              </Badge>
              <Heading size="md" noOfLines={2}>
                {title}
              </Heading>
              <Button
                mt={4}
                size="sm"
                colorScheme="blue"
                alignSelf="flex-start"
              >
                Read More
              </Button>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
