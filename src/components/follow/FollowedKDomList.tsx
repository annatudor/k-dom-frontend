import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Icon,
  Skeleton,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiBookmark, FiExternalLink } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useFollowedKDoms } from "@/hooks/useKDomFollow";
import { KDomFollowButton } from "./KDomFollowButton";

export function FollowedKDomsList() {
  const { followedKDoms, isLoading } = useFollowedKDoms();

  if (isLoading) {
    return (
      <VStack spacing={4}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height="80px" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  if (followedKDoms.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Icon as={FiBookmark} fontSize="3xl" color="gray.400" mb={4} />
        <Text color="gray.600" fontSize="lg">
          You're not following any K-Doms yet
        </Text>
        <Text color="gray.500" fontSize="sm">
          Discover and follow K-Doms to see them here
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {followedKDoms.map((kdom) => (
        <Card key={kdom.id} variant="outline" _hover={{ shadow: "md" }}>
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Text
                  as={RouterLink}
                  to={`/kdoms/${kdom.slug}`}
                  fontWeight="bold"
                  fontSize="lg"
                  _hover={{ color: "blue.600", textDecoration: "underline" }}
                  noOfLines={1}
                >
                  {kdom.title}
                </Text>
                <Icon
                  as={FiExternalLink}
                  color="gray.400"
                  _hover={{ color: "blue.500" }}
                />
              </HStack>

              <HStack justify="space-between" w="full" align="end">
                <Badge colorScheme="blue" variant="subtle">
                  {kdom.slug}
                </Badge>
                <KDomFollowButton
                  kdomId={kdom.id}
                  kdomTitle={kdom.title}
                  size="sm"
                  compact
                />
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}
