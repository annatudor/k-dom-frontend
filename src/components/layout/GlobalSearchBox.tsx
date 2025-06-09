// src/components/search/GlobalSearchBox.tsx
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Spinner,
  Avatar,
  Badge,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { FiSearch, FiTag, FiBook } from "react-icons/fi";
import { useRef } from "react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import type { KDomTagSearchResultDto, UserSearchDto } from "@/types/Search";

const SearchResultItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick: () => void;
}> = ({ icon, title, subtitle, badge, onClick }) => {
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <HStack
      p={3}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      onClick={onClick}
      borderRadius="md"
      spacing={3}
    >
      <Box color="gray.500">{icon}</Box>
      <VStack align="start" spacing={0} flex="1">
        <Text fontWeight="medium" fontSize="sm">
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="xs" color="gray.500">
            {subtitle}
          </Text>
        )}
      </VStack>
      {badge && (
        <Badge colorScheme="purple" size="sm">
          {badge}
        </Badge>
      )}
    </HStack>
  );
};

const KDomResult: React.FC<{
  kdom: KDomTagSearchResultDto;
  onClick: (slug: string) => void;
}> = ({ kdom, onClick }) => (
  <SearchResultItem
    icon={<FiBook />}
    title={kdom.title}
    subtitle={`K-Dom • /${kdom.slug}`}
    onClick={() => onClick(kdom.slug)}
  />
);

const UserResult: React.FC<{
  user: UserSearchDto;
  onClick: (userId: number) => void;
}> = ({ user, onClick }) => (
  <HStack
    p={3}
    cursor="pointer"
    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
    onClick={() => onClick(user.id)}
    borderRadius="md"
    spacing={3}
  >
    <Avatar size="sm" name={user.username} />
    <VStack align="start" spacing={0} flex="1">
      <Text fontWeight="medium" fontSize="sm">
        @{user.username}
      </Text>
      <Text fontSize="xs" color="gray.500">
        User Profile
      </Text>
    </VStack>
  </HStack>
);

const TagResult: React.FC<{
  tag: string;
  onClick: (tag: string) => void;
}> = ({ tag, onClick }) => (
  <SearchResultItem
    icon={<FiTag />}
    title={`#${tag}`}
    subtitle="Tag"
    onClick={() => onClick(tag)}
  />
);

export const GlobalSearchBox: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    hasResults,
    handleKDomSelect,
    handleUserSelect,
    handleTagSelect,
  } = useGlobalSearch();

  const searchRef = useRef<HTMLDivElement>(null);
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useOutsideClick({
    ref: searchRef,
    handler: () => setIsOpen(false),
  });

  return (
    <Box position="relative" width="100%" maxW="400px" ref={searchRef}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isLoading ? (
            <Spinner size="sm" color="gray.400" />
          ) : (
            <FiSearch color="gray" />
          )}
        </InputLeftElement>
        <Input
          placeholder="Search K-Doms, users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hasResults) setIsOpen(true);
          }}
          bg={bg}
          borderColor={borderColor}
          _focus={{
            borderColor: "purple.300",
            boxShadow: "0 0 0 1px var(--chakra-colors-purple-300)",
          }}
        />
      </InputGroup>

      {/* Search Results Dropdown */}
      {isOpen && hasResults && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt={2}
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          zIndex={1000}
          maxH="400px"
          overflowY="auto"
        >
          <VStack spacing={0} align="stretch" p={2}>
            {/* K-Doms Section */}
            {results?.kdoms && results.kdoms.length > 0 && (
              <>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  px={3}
                  py={2}
                  textTransform="uppercase"
                >
                  K-Doms
                </Text>
                {results.kdoms.slice(0, 3).map((kdom) => (
                  <KDomResult
                    key={kdom.id}
                    kdom={kdom}
                    onClick={handleKDomSelect}
                  />
                ))}
              </>
            )}

            {/* Users Section */}
            {results?.users && results.users.length > 0 && (
              <>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  px={3}
                  py={2}
                  textTransform="uppercase"
                >
                  Users
                </Text>
                {results.users.slice(0, 3).map((user) => (
                  <UserResult
                    key={user.id}
                    user={user}
                    onClick={handleUserSelect}
                  />
                ))}
              </>
            )}

            {/* Tags Section */}
            {results?.tags && results.tags.length > 0 && (
              <>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  px={3}
                  py={2}
                  textTransform="uppercase"
                >
                  Tags
                </Text>
                {results.tags.slice(0, 3).map((tag) => (
                  <TagResult key={tag} tag={tag} onClick={handleTagSelect} />
                ))}
              </>
            )}

            {/* Show more results option */}
            {hasResults && (
              <Box
                p={3}
                textAlign="center"
                borderTop="1px solid"
                borderColor={borderColor}
                mt={2}
              >
                <Text
                  fontSize="sm"
                  color="purple.500"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => {
                    // Navigate to full search page
                    window.location.href = `/search?q=${encodeURIComponent(
                      query
                    )}`;
                  }}
                >
                  View all results for "{query}"
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && !isLoading && !hasResults && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt={2}
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          zIndex={1000}
          p={4}
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.500">
            No results found for "{query}"
          </Text>
        </Box>
      )}
    </Box>
  );
};
