// src/components/Community/TrendingKDomsSection.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingKDoms } from "../../api/community";
import { VStack, Heading, Spinner, Text, Box } from "@chakra-ui/react";
import type { KDom } from "../../types/Community";

const TrendingKDomsSection: React.FC = () => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<KDom[], Error>({
    queryKey: ["trendingKDoms"],
    queryFn: getTrendingKDoms,
  });

  return (
    <Box mb={6}>
      <Heading size="md" mb={3}>
        Trending K-DOMs
      </Heading>

      {isLoading && <Spinner />}

      {isError && (
        <Text color="red.500">
          A apărut o eroare la încărcarea KDoms trending: {error?.message}
        </Text>
      )}

      {!isLoading && !isError && (
        <VStack align="stretch" spacing={2}>
          {data.length > 0 ? (
            data.map((kdom) => (
              <Box key={kdom.id} p={3} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold">{kdom.name}</Text>
                {kdom.description && (
                  <Text fontSize="sm">{kdom.description}</Text>
                )}
              </Box>
            ))
          ) : (
            <Text>Nu există KDoms trending în acest moment.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default TrendingKDomsSection;
