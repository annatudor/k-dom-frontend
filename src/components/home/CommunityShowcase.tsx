// src/components/home/CommunityShowcase.tsx
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Avatar,
  useColorModeValue,
  Icon,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FiHeart, FiUsers, FiArrowRight } from "react-icons/fi";
import { FcGlobe } from "react-icons/fc";
import { Link as RouterLink } from "react-router-dom";

interface CommunityShowcaseProps {
  platformStats: {
    totalKDoms: number;
    totalCategories: number;
    activeCollaborators: number;
  };
}

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  avatar,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      p={6}
      h="100%"
    >
      <CardBody p={0}>
        <VStack spacing={4} align="stretch" h="100%">
          <Text fontSize="md" color="gray.600" fontStyle="italic" flex="1">
            "{quote}"
          </Text>
          <HStack spacing={3}>
            <Avatar name={author} src={avatar} size="sm" />
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" fontSize="sm">
                @{author}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {role}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  platformStats,
}) => {
  const sectionBg = useColorModeValue("white", "gray.800");
  const statsBg = useColorModeValue("purple.50", "purple.900");

  const testimonials: TestimonialProps[] = [
    {
      quote:
        "I created a K-Drama wiki that now has 50+ contributors sharing episode guides and character analysis. The collaborative editing makes it so rich!",
      author: "maria_kdrama",
      role: "K-Drama enthusiast",
      avatar: "",
    },
    {
      quote:
        "Being able to collaborate on BTS content with fans worldwide is amazing. We've built the most comprehensive discography guide together!",
      author: "alex_bts",
      role: "K-Pop collaborator",
      avatar: "",
    },
    {
      quote:
        "The Korean skincare K-Dom I follow helped me understand so much about K-Beauty. The community knowledge is incredible!",
      author: "sarah_beauty",
      role: "K-Beauty explorer",
      avatar: "",
    },
  ];

  const platformFeatures = [
    {
      icon: FiUsers,
      title: "Collaborative Editing",
      description:
        "Work together with fans worldwide to create comprehensive content",
    },
    {
      icon: FiHeart,
      title: "Passionate Community",
      description:
        "Connect with like-minded K-Culture enthusiasts who share your interests",
    },
    {
      icon: FcGlobe,
      title: "Global Reach",
      description: "Share knowledge across cultures and languages",
    },
  ];

  return (
    <Box bg={sectionBg} py={20}>
      <Container maxW="1200px">
        <VStack spacing={16}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="purple.600">
              Join Our Community
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Thousands of K-Culture fans are already building something amazing
              together
            </Text>
          </VStack>

          {/* Platform Stats */}
          <Box bg={statsBg} borderRadius="xl" p={8} w="100%">
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(3, 1fr)",
              }}
              gap={8}
              textAlign="center"
            >
              <Stat>
                <StatNumber fontSize="3xl" color="purple.600">
                  {platformStats.totalKDoms.toLocaleString()}+
                </StatNumber>
                <StatLabel fontSize="md" color="gray.600">
                  K-Doms Created
                </StatLabel>
                <StatHelpText color="gray.500">
                  Knowledge bases built by fans
                </StatHelpText>
              </Stat>

              <Stat>
                <StatNumber fontSize="3xl" color="purple.600">
                  {platformStats.activeCollaborators.toLocaleString()}+
                </StatNumber>
                <StatLabel fontSize="md" color="gray.600">
                  Active Collaborators
                </StatLabel>
                <StatHelpText color="gray.500">
                  Contributors worldwide
                </StatHelpText>
              </Stat>

              <Stat>
                <StatNumber fontSize="3xl" color="purple.600">
                  50+
                </StatNumber>
                <StatLabel fontSize="md" color="gray.600">
                  Countries Represented
                </StatLabel>
                <StatHelpText color="gray.500">
                  Global K-Culture community
                </StatHelpText>
              </Stat>
            </Grid>
          </Box>

          {/* Community Features */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(3, 1fr)",
            }}
            gap={8}
            w="100%"
          >
            {platformFeatures.map((feature, index) => (
              <VStack key={index} spacing={4} textAlign="center" p={6}>
                <Icon
                  as={feature.icon}
                  boxSize={12}
                  color="purple.500"
                  bg="purple.50"
                  p={3}
                  borderRadius="full"
                />
                <Heading size="md" color="purple.600">
                  {feature.title}
                </Heading>
                <Text color="gray.600" lineHeight="tall">
                  {feature.description}
                </Text>
              </VStack>
            ))}
          </Grid>

          {/* Testimonials */}
          <VStack spacing={8} w="100%">
            <Heading size="lg" color="purple.600" textAlign="center">
              What Our Community Says
            </Heading>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(3, 1fr)",
              }}
              gap={6}
              w="100%"
            >
              {testimonials.map((testimonial, index) => (
                <Testimonial key={index} {...testimonial} />
              ))}
            </Grid>
          </VStack>

          {/* Call to Action */}
          <VStack spacing={6} textAlign="center">
            <VStack spacing={2}>
              <Heading size="lg" color="purple.600">
                Ready to Share Your K-Culture Passion?
              </Heading>
              <Text color="gray.600" maxW="500px">
                Join thousands of fans who are building the world's most
                comprehensive Korean culture knowledge base
              </Text>
            </VStack>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="purple"
                bgGradient="linear(to-r, purple.500, pink.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                  transform: "translateY(-2px)",
                }}
                boxShadow="lg"
                px={8}
                rightIcon={<FiArrowRight />}
              >
                Start Your K-Dom
              </Button>
              <Button
                as={RouterLink}
                to="/community"
                size="lg"
                variant="outline"
                colorScheme="purple"
                px={8}
                _hover={{
                  transform: "translateY(-2px)",
                }}
              >
                Join Community
              </Button>
            </HStack>

            {/* Cultural emphasis */}
            <HStack
              spacing={6}
              fontSize="sm"
              color="gray.500"
              flexWrap="wrap"
              justify="center"
            >
              <Text>🎌 Authentic Korean Culture</Text>
              <Text>🤝 Collaborative Knowledge</Text>
              <Text>🌍 Global Community</Text>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
