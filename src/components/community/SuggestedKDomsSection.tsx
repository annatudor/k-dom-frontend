// src/components/Community/SuggestedKDomsSection.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSuggestedKDoms } from "../../api/community";
import { VStack, Heading, Spinner, Text, Box } from "@chakra-ui/react";
import type { KDom } from "../../types/Community";

const SuggestedKDomsSection: React.FC = () => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<KDom[], Error>({
    queryKey: ["suggestedKDoms"],
    queryFn: getSuggestedKDoms,
  });

  return (
    <Box mb={6}>
      <Heading size="md" mb={3}>
        Suggested K-DOMs
      </Heading>

      {isLoading && <Spinner />}

      {isError && (
        <Text color="red.500">
          A apărut o eroare la încărcarea sugerărilor: {error?.message}
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
            <Text>Momentan nu avem sugestii pentru tine.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default SuggestedKDomsSection;
