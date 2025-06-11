// src/components/explore/ExploreFilters.tsx
import {
  Box,
  VStack,
  HStack,
  Heading,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Button,
  Badge,
  Wrap,
  WrapItem,
  IconButton,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiX, FiFilter, FiRefreshCw } from "react-icons/fi";
import type { Hub, Language, KDomTheme } from "@/types/KDom";
import type { ExploreFilters } from "@/api/explore";

interface ExploreFiltersProps {
  filters: ExploreFilters;
  availableHubs: Hub[];
  availableLanguages: Language[];
  availableThemes: KDomTheme[];
  facets?: {
    hubCounts: Record<string, number>;
    languageCounts: Record<string, number>;
    themeCounts: Record<string, number>;
    totalKidsContent: number;
  };
  onUpdateFilter: (key: keyof ExploreFilters, value: any) => void;
  onClearFilters: () => void;
  onClearFilter: (key: keyof ExploreFilters) => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

export const ExploreFilters: React.FC<ExploreFiltersProps> = ({
  filters,
  availableHubs,
  availableLanguages,
  availableThemes,
  facets,
  onUpdateFilter,
  onClearFilters,
  onClearFilter,
  hasActiveFilters,
  activeFiltersCount,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getHubDisplayName = (hub: Hub) => {
    const hubNames: Record<Hub, string> = {
      Music: "🎵 Music",
      Kpop: "⭐ K-Pop",
      Food: "🍜 Food",
      Beauty: "💄 Beauty",
      Gaming: "🎮 Gaming",
      Literature: "📚 Literature",
      Fashion: "👗 Fashion",
      Anime: "🎬 Anime",
    };
    return hubNames[hub] || hub;
  };

  const getLanguageDisplayName = (language: Language) => {
    const languageNames: Record<Language, string> = {
      En: "🇺🇸 English",
      Ro: "🇷🇴 Romanian",
      Kr: "🇰🇷 Korean",
      Jp: "🇯🇵 Japanese",
      Fr: "🇫🇷 French",
      De: "🇩🇪 German",
    };
    return languageNames[language] || language;
  };

  const getThemeDisplayName = (theme: KDomTheme) => {
    const themeNames: Record<KDomTheme, string> = {
      Light: "☀️ Light",
      Dark: "🌙 Dark",
      Vibrant: "🌈 Vibrant",
      Pastel: "🎨 Pastel",
    };
    return themeNames[theme] || theme;
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      sticky="true"
      top="80px"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <FiFilter />
            <Heading size="md">Filters</Heading>
            {activeFiltersCount > 0 && (
              <Badge colorScheme="purple" borderRadius="full">
                {activeFiltersCount}
              </Badge>
            )}
          </HStack>

          {hasActiveFilters && (
            <IconButton
              icon={<FiRefreshCw />}
              aria-label="Clear all filters"
              size="sm"
              variant="ghost"
              onClick={onClearFilters}
              title="Clear all filters"
            />
          )}
        </HStack>

        {/* Active Filters */}
        {hasActiveFilters && (
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Active Filters:
            </Text>
            <Wrap spacing={2}>
              {filters.hub && (
                <WrapItem>
                  <Badge
                    colorScheme="purple"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {getHubDisplayName(filters.hub)}
                    <IconButton
                      icon={<FiX />}
                      aria-label="Remove hub filter"
                      size="xs"
                      variant="ghost"
                      ml={2}
                      h="auto"
                      minW="auto"
                      p={0}
                      onClick={() => onClearFilter("hub")}
                    />
                  </Badge>
                </WrapItem>
              )}

              {filters.language && (
                <WrapItem>
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {getLanguageDisplayName(filters.language)}
                    <IconButton
                      icon={<FiX />}
                      aria-label="Remove language filter"
                      size="xs"
                      variant="ghost"
                      ml={2}
                      h="auto"
                      minW="auto"
                      p={0}
                      onClick={() => onClearFilter("language")}
                    />
                  </Badge>
                </WrapItem>
              )}

              {filters.theme && (
                <WrapItem>
                  <Badge
                    colorScheme="teal"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {getThemeDisplayName(filters.theme)}
                    <IconButton
                      icon={<FiX />}
                      aria-label="Remove theme filter"
                      size="xs"
                      variant="ghost"
                      ml={2}
                      h="auto"
                      minW="auto"
                      p={0}
                      onClick={() => onClearFilter("theme")}
                    />
                  </Badge>
                </WrapItem>
              )}

              {filters.isForKids !== undefined && (
                <WrapItem>
                  <Badge
                    colorScheme="green"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {filters.isForKids ? "Kids Content" : "Adult Content"}
                    <IconButton
                      icon={<FiX />}
                      aria-label="Remove kids filter"
                      size="xs"
                      variant="ghost"
                      ml={2}
                      h="auto"
                      minW="auto"
                      p={0}
                      onClick={() => onClearFilter("isForKids")}
                    />
                  </Badge>
                </WrapItem>
              )}

              {filters.search && (
                <WrapItem>
                  <Badge
                    colorScheme="orange"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    Search: "{filters.search}"
                    <IconButton
                      icon={<FiX />}
                      aria-label="Remove search filter"
                      size="xs"
                      variant="ghost"
                      ml={2}
                      h="auto"
                      minW="auto"
                      p={0}
                      onClick={() => onClearFilter("search")}
                    />
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
            <Divider />
          </VStack>
        )}

        {/* Category Filter */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Category
          </FormLabel>
          <Select
            value={filters.hub || ""}
            onChange={(e) => onUpdateFilter("hub", e.target.value || undefined)}
            placeholder="All Categories"
          >
            {availableHubs.map((hub) => (
              <option key={hub} value={hub}>
                {getHubDisplayName(hub)}
                {facets?.hubCounts[hub] && ` (${facets.hubCounts[hub]})`}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Language Filter */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Language
          </FormLabel>
          <Select
            value={filters.language || ""}
            onChange={(e) =>
              onUpdateFilter("language", e.target.value || undefined)
            }
            placeholder="All Languages"
          >
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {getLanguageDisplayName(language)}
                {facets?.languageCounts[language] &&
                  ` (${facets.languageCounts[language]})`}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Theme Filter */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Theme
          </FormLabel>
          <Select
            value={filters.theme || ""}
            onChange={(e) =>
              onUpdateFilter("theme", e.target.value || undefined)
            }
            placeholder="All Themes"
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {getThemeDisplayName(theme)}
                {facets?.themeCounts[theme] &&
                  ` (${facets.themeCounts[theme]})`}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Kids Content Filter */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Content Type
          </FormLabel>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm">Kids-friendly content only</Text>
              <Switch
                isChecked={filters.isForKids === true}
                onChange={(e) =>
                  onUpdateFilter(
                    "isForKids",
                    e.target.checked ? true : undefined
                  )
                }
              />
            </HStack>
            {facets?.totalKidsContent && (
              <Text fontSize="xs" color="gray.500">
                {facets.totalKidsContent} kids-friendly K-Doms available
              </Text>
            )}
          </VStack>
        </FormControl>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            colorScheme="gray"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<FiRefreshCw />}
          >
            Clear All Filters
          </Button>
        )}
      </VStack>
    </Box>
  );
};
