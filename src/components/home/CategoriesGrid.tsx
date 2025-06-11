// src/components/home/CategoriesGrid.tsx - Updated version
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Badge,
  useColorModeValue,
  Icon,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiMusic, FiTv, FiBook } from "react-icons/fi";
import { FaBowlFood } from "react-icons/fa6";
import { GiLipstick } from "react-icons/gi";
import { GiAmpleDress } from "react-icons/gi";
import { GiMusicalNotes } from "react-icons/gi";
import { IoLogoGameControllerB } from "react-icons/io";

interface CategoryStats {
  hub: string;
  count: number;
  featured: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

interface CategoriesGridProps {
  categoryStats: CategoryStats[];
}

// Definim interfața pentru informațiile categoriei
interface CategoryInfo {
  icon: React.ComponentType;
  emoji: string;
  description: string;
  color: string;
}

// Mapping pentru iconițe și emoji-uri pentru fiecare categorie
const getCategoryInfo = (hub: string): CategoryInfo => {
  const categoryMap: Record<string, CategoryInfo> = {
    Music: {
      icon: GiMusicalNotes,
      emoji: "🎵",
      description: "K-Pop, OSTs, and Korean music culture",
      color: "purple",
    },
    Anime: {
      icon: FiTv,
      emoji: "🎬",
      description: "Korean animations and webtoons",
      color: "blue",
    },
    Kpop: {
      icon: FiMusic,
      emoji: "⭐",
      description: "Groups, idols, and K-Pop industry",
      color: "pink",
    },
    Gaming: {
      icon: IoLogoGameControllerB,
      emoji: "🎮",
      description: "Korean games and esports",
      color: "green",
    },
    Literature: {
      icon: FiBook,
      emoji: "📚",
      description: "Korean literature and webtoons",
      color: "orange",
    },
    Fashion: {
      icon: GiAmpleDress,
      emoji: "👗",
      description: "K-Fashion and beauty trends",
      color: "teal",
    },
    Food: {
      icon: FaBowlFood,
      emoji: "🍜",
      description: "Korean cuisine, recipes, and food culture",
      color: "red",
    },
    Beauty: {
      icon: GiLipstick,
      emoji: "💄",
      description: "K-Beauty skincare, makeup, and trends",
      color: "cyan",
    },
  };

  return (
    categoryMap[hub] || {
      icon: FiBook,
      emoji: "📖",
      description: "Explore Korean culture",
      color: "gray",
    }
  );
};

interface CategoryCardProps {
  categoryData: CategoryStats;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ categoryData }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { hub, count, featured } = categoryData;
  const { icon, emoji, description, color } = getCategoryInfo(hub);

  const handleCategoryClick = () => {
    // Navigate to browse page filtered by this hub
    navigate(`/explore?hub=${hub}`);
  };

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="md"
      transition="all 0.3s"
      cursor="pointer"
      onClick={handleCategoryClick}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: `${color}.300`,
      }}
    >
      <VStack spacing={4} align="center" textAlign="center">
        {/* Icon and Emoji */}
        <VStack spacing={2}>
          <Text fontSize="4xl">{emoji}</Text>
          <Icon as={icon} boxSize={6} color={`${color}.500`} />
        </VStack>

        {/* Category Name */}
        <VStack spacing={1}>
          <Heading size="md" color={`${color}.600`}>
            {hub.toUpperCase()}
          </Heading>
          <Badge
            colorScheme={color}
            variant="subtle"
            borderRadius="full"
            px={3}
            py={1}
          >
            {count} K-Doms
          </Badge>
        </VStack>

        {/* Description */}
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {description}
        </Text>

        {/* Featured Preview */}
        {featured.length > 0 && (
          <VStack spacing={1} w="100%">
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              Popular:
            </Text>
            {featured.slice(0, 2).map((kdom) => (
              <Text
                key={kdom.id}
                fontSize="xs"
                color={`${color}.600`}
                noOfLines={1}
                w="100%"
                textAlign="center"
              >
                • {kdom.title}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categoryStats,
}) => {
  const sectionBg = useColorModeValue("white", "gray.800");

  // Debug logging
  console.log("CategoriesGrid categoryStats:", categoryStats);

  // Sort categories by count (descending) and filter out empty ones
  const sortedCategories = categoryStats
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Box bg={sectionBg} py={20}>
      <Container maxW="1200px">
        <VStack spacing={12}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="purple.600">
              Explore K-Culture
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Dive into different aspects of Korean culture through our
              passionate community-built K-Doms
            </Text>
          </VStack>

          {/* Categories Grid */}
          {sortedCategories.length > 0 ? (
            <>
              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={6}
                w="100%"
              >
                {sortedCategories.map((category) => (
                  <CategoryCard key={category.hub} categoryData={category} />
                ))}
              </Grid>

              {/* Total summary */}
              <VStack spacing={2} textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Explore{" "}
                  {sortedCategories.reduce((sum, cat) => sum + cat.count, 0)}{" "}
                  K-Doms across {sortedCategories.length} categories
                </Text>
              </VStack>
            </>
          ) : (
            <VStack spacing={4} py={12}>
              <Text fontSize="lg" color="gray.500">
                🚀 Categories loading...
              </Text>
              <Text fontSize="sm" color="gray.400">
                Our community is building amazing K-Culture content!
              </Text>

              {/* Show placeholder categories when no data */}
              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={6}
                w="100%"
                mt={8}
              >
                {[
                  "Music",
                  "Kpop",
                  "Food",
                  "Beauty",
                  "Gaming",
                  "Literature",
                  "Fashion",
                  "Anime",
                ].map((hub) => {
                  const { icon, emoji, description, color } =
                    getCategoryInfo(hub);

                  return (
                    <Box
                      key={hub}
                      p={6}
                      borderRadius="xl"
                      border="1px solid"
                      opacity={0.7}
                    >
                      <VStack spacing={4} align="center" textAlign="center">
                        <VStack spacing={2}>
                          <Text fontSize="4xl">{emoji}</Text>
                          <Icon as={icon} boxSize={6} color={`${color}.400`} />
                        </VStack>
                        <VStack spacing={1}>
                          <Heading size="md" color={`${color}.500`}>
                            {hub.toUpperCase()}
                          </Heading>
                          <Badge
                            colorScheme={color}
                            variant="outline"
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            Coming Soon
                          </Badge>
                        </VStack>
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {description}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </Grid>
            </VStack>
          )}

          {/* Browse All Button */}
          <Button
            as={RouterLink}
            to="/explore"
            size="lg"
            variant="outline"
            colorScheme="purple"
            px={8}
            _hover={{
              transform: "translateY(-2px)",
            }}
          >
            Browse All Categories
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
