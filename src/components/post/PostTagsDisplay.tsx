// src/components/post/PostTagsDisplay.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Wrap,
  WrapItem,
  useColorModeValue,
  Tooltip,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FiTag, FiHash, FiTrendingUp, FiUsers } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

interface PostTagsDisplayProps {
  tags: string[];
  variant?: "compact" | "detailed" | "inline";
  showIcon?: boolean;
  showStats?: boolean;
}

export function PostTagsDisplay({
  tags,
  variant = "detailed",
  showIcon = true,
  showStats = false,
}: PostTagsDisplayProps) {
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("blue.200", "blue.700");
  const textColor = useColorModeValue("blue.700", "blue.200");

  if (!tags || tags.length === 0) {
    return null;
  }

  // Compact variant - doar tag-urile inline
  if (variant === "compact") {
    return (
      <Wrap spacing={2}>
        {tags.map((tag) => (
          <WrapItem key={tag}>
            <Badge
              as={RouterLink}
              to={`/kdom/${tag}`}
              colorScheme="blue"
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="medium"
              _hover={{
                bg: "blue.100",
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              cursor="pointer"
              transition="all 0.2s"
            >
              #{tag}
            </Badge>
          </WrapItem>
        ))}
      </Wrap>
    );
  }

  // Inline variant - pentru header-e și locuri mici
  if (variant === "inline") {
    return (
      <HStack spacing={2} flexWrap="wrap">
        {showIcon && <Icon as={FiTag} color="blue.500" boxSize={3} />}
        {tags.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            as={RouterLink}
            to={`/kdom/${tag}`}
            colorScheme="blue"
            variant="outline"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            _hover={{ textDecoration: "none", bg: "blue.50" }}
          >
            #{tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Text fontSize="xs" color="gray.500">
            +{tags.length - 3} more
          </Text>
        )}
      </HStack>
    );
  }

  // Detailed variant - pentru pagina de detaliu
  return (
    <Card
      bg={bgColor}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
    >
      <CardBody p={5}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack spacing={3} align="center">
            {showIcon && <Icon as={FiTag} color="blue.500" boxSize={5} />}
            <VStack align="start" spacing={0} flex="1">
              <Text fontSize="md" fontWeight="bold" color={textColor}>
                Featured in K-Doms
              </Text>
              <Text fontSize="sm" color="gray.500">
                This post appears in {tags.length} K-Dom
                {tags.length > 1 ? "s" : ""}
              </Text>
            </VStack>
          </HStack>

          {/* Tags Grid */}
          <Wrap spacing={3}>
            {tags.map((tag, index) => (
              <WrapItem key={tag}>
                <Tooltip label={`Visit ${tag} K-Dom`} placement="top" hasArrow>
                  <Badge
                    as={RouterLink}
                    to={`/kdom/${tag}`}
                    colorScheme="blue"
                    variant="solid"
                    px={4}
                    py={3}
                    borderRadius="lg"
                    fontSize="sm"
                    fontWeight="bold"
                    minH="40px"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    _hover={{
                      bg: "blue.600",
                      textDecoration: "none",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    cursor="pointer"
                    transition="all 0.3s"
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      bg: `blue.${300 + (index % 3) * 100}`,
                    }}
                  >
                    <Icon as={FiHash} boxSize={4} />
                    <Text>{tag}</Text>
                    {showStats && (
                      <HStack spacing={1} ml={2}>
                        <Icon as={FiUsers} boxSize={3} opacity={0.8} />
                        <Text fontSize="xs" opacity={0.9}>
                          {Math.floor(Math.random() * 1000)}
                        </Text>
                      </HStack>
                    )}
                  </Badge>
                </Tooltip>
              </WrapItem>
            ))}
          </Wrap>

          {/* Footer info */}
          <Box pt={2} borderTop="1px solid" borderColor={borderColor}>
            <HStack justify="space-between" align="center">
              <Text fontSize="xs" color="gray.500">
                Click on any K-Dom to explore related content
              </Text>
              <HStack spacing={1}>
                <Icon as={FiTrendingUp} boxSize={3} color="green.500" />
                <Text fontSize="xs" color="green.600" fontWeight="medium">
                  Trending topics
                </Text>
              </HStack>
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
