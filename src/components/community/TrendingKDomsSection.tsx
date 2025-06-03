// src/components/community/TrendingKDomsSection.tsx - Compact fandom-style
import { useState } from "react";
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  IconButton,
  useColorModeValue,
  Icon,
  Heading,
  Badge,
  Box,
} from "@chakra-ui/react";
import {
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { followKDom } from "@/api/kdomFollow";
import type { KDomTrendingDto } from "@/types/KDom";

interface TrendingKDomsSectionProps {
  trendingKdoms: KDomTrendingDto[];
  isLoading: boolean;
}

export function TrendingKDomsSection({
  trendingKdoms,
  isLoading,
}: TrendingKDomsSectionProps) {
  const [showMore, setShowMore] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const toast = useToast();
  const queryClient = useQueryClient();

  // Mutation pentru follow K-Dom
  const followMutation = useMutation({
    mutationFn: followKDom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followed-kdoms"] });
      toast({
        title: "Fandom followed!",
        status: "success",
        duration: 2000,
        size: "sm",
      });
    },
    onError: () => {
      toast({
        title: "Failed to follow fandom",
        status: "error",
        duration: 2000,
        size: "sm",
      });
    },
  });

  const handleFollow = (kdomId: string) => {
    followMutation.mutate(kdomId);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        w="full"
      >
        <CardBody p={4}>
          <VStack spacing={3}>
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="orange.500" boxSize={4} />
              <Heading size="sm" color={textColor}>
                Trending Fandoms
              </Heading>
            </HStack>

            <VStack spacing={2} w="full">
              {[1, 2, 3, 4, 5].map((i) => (
                <HStack key={i} w="full" p={2}>
                  <Avatar size="xs" />
                  <VStack align="start" spacing={0} flex="1">
                    <Box h={3} bg="gray.200" borderRadius="sm" w="60%" />
                    <Box h={2} bg="gray.100" borderRadius="sm" w="40%" />
                  </VStack>
                  <Box w={6} h={6} bg="orange.200" borderRadius="sm" />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const displayedKdoms = showMore ? trendingKdoms : trendingKdoms.slice(0, 5);

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
      w="full"
    >
      <CardBody p={4}>
        <VStack spacing={3}>
          <HStack spacing={2}>
            <Icon as={FiTrendingUp} color="orange.500" boxSize={4} />
            <Heading size="sm" color={textColor}>
              Trending Fandoms
            </Heading>
          </HStack>

          {/* K-Doms list */}
          <VStack spacing={2} w="full">
            {displayedKdoms.map((kdom, index) => (
              <HStack
                key={kdom.id}
                w="full"
                p={2}
                borderRadius="md"
                _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
              >
                <HStack spacing={2} flex="1">
                  <Avatar size="xs" name={kdom.title} />
                  <VStack align="start" spacing={0} flex="1">
                    <HStack spacing={1}>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={textColor}
                        noOfLines={1}
                      >
                        {kdom.title}
                      </Text>
                      {index < 3 && (
                        <Badge
                          colorScheme={
                            index === 0
                              ? "orange"
                              : index === 1
                              ? "yellow"
                              : "green"
                          }
                          size="xs"
                          borderRadius="full"
                          fontSize="9px"
                          px={1}
                        >
                          #{index + 1}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="10px" color="gray.500">
                      {(kdom.TotalScore * 1000).toFixed(0)}K Followers
                    </Text>
                  </VStack>
                </HStack>
                <IconButton
                  icon={<Icon as={FiHeart} />}
                  colorScheme="orange"
                  variant="solid"
                  size="xs"
                  borderRadius="sm"
                  aria-label="Follow Fandom"
                  onClick={() => handleFollow(kdom.id)}
                  isLoading={followMutation.isPending}
                />
              </HStack>
            ))}
          </VStack>

          {/* See More toggle */}
          {trendingKdoms.length > 5 && (
            <Button
              leftIcon={<Icon as={showMore ? FiChevronUp : FiChevronDown} />}
              variant="ghost"
              size="xs"
              onClick={() => setShowMore(!showMore)}
              color="orange.600"
              fontSize="xs"
              fontWeight="bold"
            >
              {showMore ? "SEE LESS" : "SEE MORE"}
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
