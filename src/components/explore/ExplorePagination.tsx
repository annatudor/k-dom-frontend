// src/components/explore/ExplorePagination.tsx
import {
  Box,
  HStack,
  Button,
  Text,
  Select,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

interface ExplorePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const ExplorePagination: React.FC<ExplorePaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  canGoNext,
  canGoPrev,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Calculate result range
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalCount);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      mt={6}
    >
      <HStack justify="space-between" align="center" spacing={4}>
        {/* Results Info */}
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Showing {startResult.toLocaleString()}-{endResult.toLocaleString()}{" "}
            of {totalCount.toLocaleString()} results
          </Text>

          {/* Page Size Selector */}
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              Show:
            </Text>
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              w="auto"
              minW="70px"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
            <Text fontSize="sm" color="gray.600">
              per page
            </Text>
          </HStack>
        </HStack>

        {/* Pagination Controls */}
        <HStack spacing={1}>
          {/* First Page */}
          <IconButton
            icon={<FiChevronsLeft />}
            aria-label="First page"
            size="sm"
            variant="ghost"
            isDisabled={!canGoPrev}
            onClick={() => onPageChange(1)}
          />

          {/* Previous Page */}
          <IconButton
            icon={<FiChevronLeft />}
            aria-label="Previous page"
            size="sm"
            variant="ghost"
            isDisabled={!canGoPrev}
            onClick={() => onPageChange(currentPage - 1)}
          />

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <Box key={index}>
              {page === "..." ? (
                <Text px={2} fontSize="sm" color="gray.500">
                  ...
                </Text>
              ) : (
                <Button
                  size="sm"
                  variant={currentPage === page ? "solid" : "ghost"}
                  colorScheme={currentPage === page ? "purple" : "gray"}
                  onClick={() => onPageChange(page as number)}
                  minW="40px"
                >
                  {page}
                </Button>
              )}
            </Box>
          ))}

          {/* Next Page */}
          <IconButton
            icon={<FiChevronRight />}
            aria-label="Next page"
            size="sm"
            variant="ghost"
            isDisabled={!canGoNext}
            onClick={() => onPageChange(currentPage + 1)}
          />

          {/* Last Page */}
          <IconButton
            icon={<FiChevronsRight />}
            aria-label="Last page"
            size="sm"
            variant="ghost"
            isDisabled={!canGoNext}
            onClick={() => onPageChange(totalPages)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};
