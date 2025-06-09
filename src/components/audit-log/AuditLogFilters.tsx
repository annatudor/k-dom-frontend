// src/components/audit-log/AuditLogFilters.tsx - Simple version (placeholder)
import {
  VStack,
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import type {
  AuditAction,
  AuditTargetType,
  AuditLogFilterDto,
} from "@/types/AuditLog";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_TARGET_TYPE_LABELS,
} from "@/types/AuditLog";

interface AuditLogFiltersProps {
  activeFilters: Partial<AuditLogFilterDto>;
  onActionChange: (action?: AuditAction) => void;
  onUserChange: (userId?: number) => void;
  onTargetTypeChange: (targetType?: AuditTargetType) => void;
  onDateRangeChange: (from?: string, to?: string) => void;
}

export function AuditLogFilters({
  activeFilters,
  onActionChange,
  onUserChange,
  onTargetTypeChange,
  onDateRangeChange,
}: AuditLogFiltersProps) {
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold">
        Filter Audit Logs
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Action</FormLabel>
          <Select
            value={activeFilters.action || ""}
            onChange={(e) =>
              onActionChange((e.target.value as AuditAction) || undefined)
            }
            placeholder="All actions"
          >
            {Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>User ID</FormLabel>
          <Input
            type="number"
            value={activeFilters.userId?.toString() || ""}
            onChange={(e) =>
              onUserChange(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            placeholder="User ID"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Target Type</FormLabel>
          <Select
            value={activeFilters.targetType || ""}
            onChange={(e) =>
              onTargetTypeChange(
                (e.target.value as AuditTargetType) || undefined
              )
            }
            placeholder="All target types"
          >
            {Object.entries(AUDIT_TARGET_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input
            value={activeFilters.search || ""}
            onChange={(e) => {
              // Handle search change - you may need to add this to the interface
              console.log("Search:", e.target.value);
            }}
            placeholder="Search details..."
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>From Date</FormLabel>
          <Input
            type="datetime-local"
            value={activeFilters.from || ""}
            onChange={(e) =>
              onDateRangeChange(e.target.value || undefined, activeFilters.to)
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>To Date</FormLabel>
          <Input
            type="datetime-local"
            value={activeFilters.to || ""}
            onChange={(e) =>
              onDateRangeChange(activeFilters.from, e.target.value || undefined)
            }
          />
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
}
