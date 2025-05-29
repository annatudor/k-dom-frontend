// src/components/Community/FeedSection.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeed, getGuestFeed } from "../../api/community";
import { VStack, Heading, Spinner, Text, Box, Divider } from "@chakra-ui/react";
import type { Post } from "../../types/Community";

const FeedSection: React.FC = () => {
  // Încearcă întâi feed-ul autenticat, dacă dă 401 folosește guest
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>({
    queryKey: ["feed"],
    queryFn: getFeed,
    retry: false,
  });

  // Dacă e eroare de autorizare, încarcă guest-feed
  const {
    data: guestPosts,
    isLoading: isGuestLoading,
    isError: isGuestError,
  } = useQuery<Post[], Error>({
    queryKey: ["guestFeed"],
    queryFn: getGuestFeed,
    enabled:
      isError &&
      (error?.message.includes("401") ||
        error?.message.includes("Unauthorized")),
    retry: false,
  });

  const displayPosts = !isError ? posts : guestPosts;
  const loading = isLoading || isGuestLoading;
  const errorMessage = isError && !isGuestError ? error?.message : undefined;

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Feed
      </Heading>

      {loading && <Spinner />}

      {errorMessage && (
        <Text color="red.500" mb={4}>
          A apărut o eroare la încărcarea feed-ului: {errorMessage}
        </Text>
      )}

      {!loading && (
        <VStack align="stretch" spacing={6}>
          {displayPosts && displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <Box key={post.id} p={4} borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" color="gray.500">
                  {new Date(post.createdAt).toLocaleString()} &nbsp;|&nbsp;{" "}
                  {post.authorName}
                </Text>
                <Divider my={2} />
                <Text>{post.content}</Text>
              </Box>
            ))
          ) : (
            <Text>Nu există postări de afișat.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default FeedSection;
