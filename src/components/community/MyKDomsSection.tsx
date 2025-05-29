// src/components/Community/MyKDomsSection.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyKDoms } from "../../api/community";
import { VStack, Heading, Spinner, Text, Box } from "@chakra-ui/react";
import type { KDom } from "../../types/Community";

const MyKDomsSection: React.FC = () => {
  // -- noul apel useQuery cu obiect de opțiuni --
  const { data, isLoading, error } = useQuery<KDom[], Error>({
    queryKey: ["myKDoms"],
    queryFn: getMyKDoms,
    // puteți adăuga staleTime, cacheTime etc. aici
  });

  React.useEffect(() => {
    console.log("getMyKDoms returned →", data);
  }, [data]);

  return (
    <Box mb={6}>
      <Heading size="md" mb={3}>
        My KDoms
      </Heading>

      {isLoading && <Spinner />}

      {error && (
        <Text color="red.500">
          A apărut o eroare la încărcarea KDoms: {error.message}
        </Text>
      )}

      {!isLoading && !error && (
        <VStack align="stretch" spacing={2}>
          {data?.length ? (
            data.map((kdom: KDom) => (
              <Box key={kdom.id} p={3} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold">{kdom.name}</Text>
                {kdom.description && (
                  <Text fontSize="sm">{kdom.description}</Text>
                )}
              </Box>
            ))
          ) : (
            <Text>Nu ești abonat la niciun KDoms încă.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default MyKDomsSection;
