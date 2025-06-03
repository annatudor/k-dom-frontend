// src/components/community/TrendingKDomsSection.tsx
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
  Collapse,
  Badge,
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
        title: "K-Dom followed!",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to follow K-Dom",
        status: "error",
        duration: 3000,
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
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="lg"
      >
        <CardBody p={6}>
          <VStack spacing={4}>
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="orange.500" boxSize={5} />
              <Heading size="md" color={textColor}>
                Trending K-Doms
              </Heading>
            </HStack>

            <VStack spacing={3} w="full">
              {[1, 2, 3, 4, 5].map((i) => (
                <HStack key={i} w="full" p={3}>
                  <Avatar size="sm" />
                  <VStack align="start" spacing={1} flex="1">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-2 bg-gray-100 rounded w-16"></div>
                  </VStack>
                  <div className="w-8 h-8 bg-purple-200 rounded"></div>
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
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
    >
      <CardBody p={6}>
        <VStack spacing={4}>
          <HStack spacing={2}>
            <Icon as={FiTrendingUp} color="orange.500" boxSize={5} />
            <Heading size="md" color={textColor}>
              Trending K-Doms
            </Heading>
          </HStack>

          {/* K-Doms list */}
          <VStack spacing={3} w="full">
            {displayedKdoms.map((kdom, index) => (
              <HStack
                key={kdom.id}
                w="full"
                p={3}
                borderRadius="lg"
                _hover={{ bg: "gray.50" }}
              >
                <HStack spacing={3} flex="1">
                  <Avatar size="sm" name={kdom.title} />
                  <VStack align="start" spacing={1} flex="1">
                    <HStack spacing={2}>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        color={textColor}
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
                          size="sm"
                          borderRadius="full"
                        >
                          #{index + 1}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {(kdom.TotalScore * 1000).toFixed(0)}K Followers
                    </Text>
                  </VStack>
                </HStack>
                <IconButton
                  icon={<Icon as={FiHeart} />}
                  colorScheme="purple"
                  variant="solid"
                  size="sm"
                  borderRadius="md"
                  aria-label="Follow K-Dom"
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
              size="sm"
              onClick={() => setShowMore(!showMore)}
              color="orange.600"
            >
              {showMore ? "SEE LESS" : "SEE MORE"}
            </Button>
          )}

          {/* Collapsed additional content */}
          <Collapse in={showMore} animateOpacity>
            <VStack spacing={4} pt={4}>
              <Button
                leftIcon={<Icon as={FiHeart} />}
                variant="outline"
                colorScheme="orange"
                borderRadius="xl"
                px={6}
                w="full"
              >
                ADD K-DOMS
              </Button>
            </VStack>
          </Collapse>

          {/* Add K-Doms button (always visible when not expanded) */}
          {!showMore && (
            <Button
              leftIcon={<Icon as={FiHeart} />}
              variant="outline"
              colorScheme="orange"
              borderRadius="xl"
              px={6}
              w="full"
            >
              ADD K-DOMS
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
