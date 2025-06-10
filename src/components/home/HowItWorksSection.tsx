// src/components/home/HowItWorksSection.tsx
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Icon,
  useColorModeValue,
  Circle,
  HStack,
} from "@chakra-ui/react";
import { FiPlus, FiUsers, FiCompass } from "react-icons/fi";

interface StepProps {
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  examples: string[];
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({
  icon,
  emoji,
  title,
  description,
  examples,
  stepNumber,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={cardBg}
      p={8}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="lg"
      position="relative"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      {/* Step Number */}
      <Circle
        size="40px"
        bg="purple.500"
        color="white"
        position="absolute"
        top="-20px"
        left="50%"
        transform="translateX(-50%)"
        fontWeight="bold"
        fontSize="lg"
      >
        {stepNumber}
      </Circle>

      <VStack spacing={4} align="center" textAlign="center">
        {/* Icon and Emoji */}
        <HStack spacing={2}>
          <Text fontSize="3xl">{emoji}</Text>
          <Icon as={icon} boxSize={8} color="purple.500" />
        </HStack>

        {/* Title */}
        <Heading size="md" color="purple.600">
          {title}
        </Heading>

        {/* Description */}
        <Text color="gray.600" lineHeight="tall">
          {description}
        </Text>

        {/* Examples */}
        <VStack spacing={1} fontSize="sm" color="gray.500">
          {examples.map((example, index) => (
            <Text key={index} fontStyle="italic">
              "{example}"
            </Text>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export const HowItWorksSection: React.FC = () => {
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  const steps: StepProps[] = [
    {
      icon: FiPlus,
      emoji: "🎵",
      title: "CREATE",
      description:
        "Start your K-Dom about your favorite K-Culture topics. Share your passion and knowledge with the world.",
      examples: [
        "BTS Complete Discography",
        "Korean Skincare Guide",
        "K-Drama Episode Reviews",
      ],
      stepNumber: 1,
    },
    {
      icon: FiUsers,
      emoji: "🤝",
      title: "COLLABORATE",
      description:
        "Invite others to contribute and build together. Every K-Dom becomes richer with diverse perspectives.",
      examples: [
        "Co-edit with fellow fans",
        "Share different viewpoints",
        "Build comprehensive guides",
      ],
      stepNumber: 2,
    },
    {
      icon: FiCompass,
      emoji: "📚",
      title: "EXPLORE",
      description:
        "Discover amazing content from the community. Find new interests and connect with like-minded fans.",
      examples: [
        "Browse by categories",
        "Follow your interests",
        "Join discussions",
      ],
      stepNumber: 3,
    },
  ];

  return (
    <Box bg={sectionBg} py={20}>
      <Container maxW="1200px">
        <VStack spacing={16}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="purple.600">
              How K-Dom Works
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Building K-Culture knowledge together, one collaboration at a time
            </Text>
          </VStack>

          {/* Steps Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(3, 1fr)",
            }}
            gap={8}
            w="100%"
          >
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </Grid>

          {/* Bottom CTA */}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="lg" color="gray.600">
              Ready to start your K-Culture journey?
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                🎌 Authentic • 🤝 Collaborative • 📚 Comprehensive
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
