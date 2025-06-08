// src/components/profile/ProfileContentTabs.tsx
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  Button,
  Icon,
  useColorModeValue,
  Skeleton,
  Box,
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiUsers,
  FiEdit3,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import type { UserProfileReadDto } from "@/types/User";

interface ProfileContentTabsProps {
  profile: UserProfileReadDto;
  isLoading?: boolean;
}

export function ProfileContentTabs({
  profile,
  isLoading,
}: ProfileContentTabsProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
      >
        <CardBody>
          <VStack spacing={4}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="80px" width="100%" />
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
    >
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Icon as={FiBookOpen} />
              <Text>K-Doms</Text>
              <Badge borderRadius="full" fontSize="xs">
                {profile.ownedKDoms.length + profile.collaboratedKDoms.length}
              </Badge>
            </HStack>
          </Tab>

          <Tab>
            <HStack spacing={2}>
              <Icon as={FiEdit3} />
              <Text>Posts</Text>
              <Badge borderRadius="full" fontSize="xs">
                {profile.recentPosts.length}
              </Badge>
            </HStack>
          </Tab>

          {profile.isOwnProfile && (
            <>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FiUsers} />
                  <Text>Following</Text>
                  <Badge borderRadius="full" fontSize="xs">
                    {profile.followedKDoms.length}
                  </Badge>
                </HStack>
              </Tab>

              <Tab>
                <HStack spacing={2}>
                  <Icon as={FiEye} />
                  <Text>Recent</Text>
                  <Badge borderRadius="full" fontSize="xs">
                    {profile.recentlyViewedKDoms.length}
                  </Badge>
                </HStack>
              </Tab>
            </>
          )}
        </TabList>

        <TabPanels>
          {/* K-Doms Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Owned K-Doms */}
              {profile.ownedKDoms.length > 0 && (
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    mb={4}
                    color="blue.600"
                  >
                    Created K-Doms ({profile.ownedKDoms.length})
                  </Text>
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    {profile.ownedKDoms.map((kdom) => (
                      <GridItem key={kdom.id}>
                        <Card
                          bg={useColorModeValue("gray.50", "gray.700")}
                          _hover={{
                            shadow: "md",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                        >
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" w="full">
                                <Badge colorScheme="blue" variant="subtle">
                                  Owner
                                </Badge>
                                <Button
                                  as={RouterLink}
                                  to={`/kdoms/slug/${kdom.slug}`}
                                  size="xs"
                                  variant="ghost"
                                  rightIcon={<Icon as={FiExternalLink} />}
                                >
                                  View
                                </Button>
                              </HStack>

                              <VStack align="start" spacing={1} w="full">
                                <Text fontWeight="semibold" noOfLines={1}>
                                  {kdom.title}
                                </Text>
                                {kdom.description && (
                                  <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    noOfLines={2}
                                  >
                                    {kdom.description}
                                  </Text>
                                )}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Collaborated K-Doms */}
              {profile.collaboratedKDoms.length > 0 && (
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    mb={4}
                    color="purple.600"
                  >
                    Collaborated K-Doms ({profile.collaboratedKDoms.length})
                  </Text>
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    {profile.collaboratedKDoms.map((kdom) => (
                      <GridItem key={kdom.id}>
                        <Card
                          bg={useColorModeValue("gray.50", "gray.700")}
                          _hover={{
                            shadow: "md",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                        >
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" w="full">
                                <Badge colorScheme="purple" variant="subtle">
                                  Collaborator
                                </Badge>
                                <Button
                                  as={RouterLink}
                                  to={`/kdoms/slug/${kdom.slug}`}
                                  size="xs"
                                  variant="ghost"
                                  rightIcon={<Icon as={FiExternalLink} />}
                                >
                                  View
                                </Button>
                              </HStack>

                              <VStack align="start" spacing={1} w="full">
                                <Text fontWeight="semibold" noOfLines={1}>
                                  {kdom.title}
                                </Text>
                                {kdom.description && (
                                  <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    noOfLines={2}
                                  >
                                    {kdom.description}
                                  </Text>
                                )}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
              )}

              {profile.ownedKDoms.length === 0 &&
                profile.collaboratedKDoms.length === 0 && (
                  <VStack spacing={4} py={12} textAlign="center">
                    <Icon as={FiBookOpen} boxSize={12} color="gray.400" />
                    <VStack spacing={2}>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="gray.500"
                      >
                        No K-Doms yet
                      </Text>
                      <Text color="gray.400">
                        {profile.isOwnProfile
                          ? "Start creating your first K-Dom to share knowledge with the community!"
                          : "This user hasn't created any K-Doms yet."}
                      </Text>
                    </VStack>
                    {profile.isOwnProfile && (
                      <Button
                        as={RouterLink}
                        to="/start-kdom"
                        colorScheme="blue"
                        leftIcon={<Icon as={FiBookOpen} />}
                      >
                        Create Your First K-Dom
                      </Button>
                    )}
                  </VStack>
                )}
            </VStack>
          </TabPanel>

          {/* Posts Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {profile.recentPosts.length > 0 ? (
                profile.recentPosts.map((post) => (
                  <Card
                    key={post.id}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full">
                          <HStack spacing={2}>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </Text>
                            {post.isEdited && (
                              <Badge
                                colorScheme="orange"
                                variant="subtle"
                                fontSize="xs"
                              >
                                Edited
                              </Badge>
                            )}
                          </HStack>
                          <Button
                            as={RouterLink}
                            to={`/posts/${post.id}`}
                            size="xs"
                            variant="ghost"
                            rightIcon={<Icon as={FiExternalLink} />}
                          >
                            View
                          </Button>
                        </HStack>

                        <Box
                          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                          sx={{
                            "& p": { mb: 2 },
                            "& h1, & h2, & h3": { fontWeight: "bold", mb: 2 },
                          }}
                        />

                        {post.tags.length > 0 && (
                          <HStack spacing={2} flexWrap="wrap">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                colorScheme="blue"
                                variant="outline"
                                fontSize="xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Text fontSize="xs" color="gray.500">
                                +{post.tags.length - 3} more
                              </Text>
                            )}
                          </HStack>
                        )}

                        <HStack spacing={4} fontSize="sm" color="gray.500">
                          <Text>{post.likeCount} likes</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <VStack spacing={4} py={12} textAlign="center">
                  <Icon as={FiEdit3} boxSize={12} color="gray.400" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                      No posts yet
                    </Text>
                    <Text color="gray.400">
                      {profile.isOwnProfile
                        ? "Share your thoughts and ideas with the community!"
                        : "This user hasn't posted anything yet."}
                    </Text>
                  </VStack>
                  {profile.isOwnProfile && (
                    <Button
                      as={RouterLink}
                      to="/create-post"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiEdit3} />}
                    >
                      Create Your First Post
                    </Button>
                  )}
                </VStack>
              )}
            </VStack>
          </TabPanel>

          {/* Following Tab (doar pentru profil propriu) */}
          {profile.isOwnProfile && (
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {profile.followedKDoms.length > 0 ? (
                  <Box>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      mb={4}
                      color="teal.600"
                    >
                      Followed K-Doms ({profile.followedKDoms.length})
                    </Text>
                    <Grid
                      templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      gap={4}
                    >
                      {profile.followedKDoms.map((kdom) => (
                        <GridItem key={kdom.id}>
                          <Card
                            bg={useColorModeValue("gray.50", "gray.700")}
                            _hover={{
                              shadow: "md",
                              transform: "translateY(-2px)",
                            }}
                            transition="all 0.2s"
                          >
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" w="full">
                                  <Badge colorScheme="teal" variant="subtle">
                                    Following
                                  </Badge>
                                  <Button
                                    as={RouterLink}
                                    to={`/kdoms/slug/${kdom.slug}`}
                                    size="xs"
                                    variant="ghost"
                                    rightIcon={<Icon as={FiExternalLink} />}
                                  >
                                    View
                                  </Button>
                                </HStack>

                                <Text fontWeight="semibold" noOfLines={2}>
                                  {kdom.title}
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        </GridItem>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <VStack spacing={4} py={12} textAlign="center">
                    <Icon as={FiUsers} boxSize={12} color="gray.400" />
                    <VStack spacing={2}>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="gray.500"
                      >
                        Not following any K-Doms
                      </Text>
                      <Text color="gray.400">
                        Discover and follow K-Doms that interest you to see
                        updates in your feed!
                      </Text>
                    </VStack>
                    <Button
                      as={RouterLink}
                      to="/community"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiUsers} />}
                    >
                      Explore K-Doms
                    </Button>
                  </VStack>
                )}
              </VStack>
            </TabPanel>
          )}

          {/* Recently Viewed Tab (doar pentru profil propriu) */}
          {profile.isOwnProfile && (
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {profile.recentlyViewedKDoms.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={4}
                  >
                    {profile.recentlyViewedKDoms.map((kdom) => (
                      <GridItem key={kdom.id}>
                        <Card
                          bg={useColorModeValue("gray.50", "gray.700")}
                          _hover={{
                            shadow: "md",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                        >
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" w="full">
                                <Badge colorScheme="gray" variant="subtle">
                                  Recently Viewed
                                </Badge>
                                <Button
                                  as={RouterLink}
                                  to={`/kdoms/slug/${kdom.slug}`}
                                  size="xs"
                                  variant="ghost"
                                  rightIcon={<Icon as={FiExternalLink} />}
                                >
                                  View
                                </Button>
                              </HStack>

                              <VStack align="start" spacing={1} w="full">
                                <Text fontWeight="semibold" noOfLines={1}>
                                  {kdom.title}
                                </Text>
                                {kdom.description && (
                                  <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    noOfLines={2}
                                  >
                                    {kdom.description}
                                  </Text>
                                )}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <VStack spacing={4} py={12} textAlign="center">
                    <Icon as={FiEye} boxSize={12} color="gray.400" />
                    <VStack spacing={2}>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="gray.500"
                      >
                        No recently viewed K-Doms
                      </Text>
                      <Text color="gray.400">
                        K-Doms you visit will appear here for quick access.
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Card>
  );
}
