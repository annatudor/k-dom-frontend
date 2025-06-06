// src/components/admin/users/UserManagement.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiShield,
  FiUser,
} from "react-icons/fi";
import {
  useUsers,
  useUserSearch,
  useUserActions,
  useUserAdminPermissions,
  useUserStatsQuick,
} from "@/hooks/useUserAdmin";
import {
  getRoleColor,
  getRoleLabel,
  formatUserDate,
  isValidRole,
} from "@/api/userAdmin";
import type { UserPublicDto } from "@/types/User";

export function UserManagement() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const {
    data: usersData,
    isLoading,
    error,
    filter,
    updateFilter,
    goToPage,
    resetFilter,
  } = useUsers({
    page: 1,
    pageSize: 20,
  });

  const { searchResults, isSearching, search, clearSearch } = useUserSearch();
  const { changeRole, isChangingRole } = useUserActions();
  const permissions = useUserAdminPermissions();
  const { totalUsers } = useUserStatsQuick();

  const {
    isOpen: isRoleModalOpen,
    onOpen: onRoleModalOpen,
    onClose: onRoleModalClose,
  } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState<UserPublicDto | null>(null);
  const [newRole, setNewRole] = useState("");

  if (!permissions.canViewUsers) {
    return (
      <Alert status="error">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Access Denied</Text>
          <Text>You don't have permission to view user management.</Text>
        </VStack>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <VStack spacing={4}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Text fontSize="lg" color="gray.600">
          Loading users...
        </Text>
      </VStack>
    );
  }

  if (error || !usersData) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load users. Please try again later.
      </Alert>
    );
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length >= 2) {
      search(value);
    } else {
      clearSearch();
    }
  };

  const handleFilter = () => {
    updateFilter({
      username: searchTerm || undefined,
      role: roleFilter || undefined,
      page: 1,
    });
    clearSearch();
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    setRoleFilter("");
    resetFilter();
    clearSearch();
  };

  const handleChangeRole = (user: UserPublicDto) => {
    setSelectedUser(user);
    setNewRole(user.role);
    onRoleModalOpen();
  };

  const confirmRoleChange = () => {
    if (selectedUser && newRole && newRole !== selectedUser.role) {
      changeRole({
        userId: selectedUser.id,
        data: { newRole },
      });
      onRoleModalClose();
    }
  };

  const UserRow = ({ user }: { user: UserPublicDto }) => (
    <Tr key={user.id}>
      <Td>
        <HStack spacing={3}>
          <Avatar size="sm" name={user.username} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="medium">{user.username}</Text>
            <Text fontSize="sm" color="gray.500">
              ID: {user.id}
            </Text>
          </VStack>
        </HStack>
      </Td>
      <Td>
        <Text fontSize="sm">{user.email}</Text>
      </Td>
      <Td>
        <Badge colorScheme={getRoleColor(user.role)} variant="subtle">
          {getRoleLabel(user.role)}
        </Badge>
      </Td>
      <Td>
        <Text fontSize="sm">{formatUserDate(user.createdAt)}</Text>
      </Td>
      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            aria-label="User actions"
          />
          <MenuList>
            {permissions.canChangeRoles && (
              <MenuItem
                icon={<FiShield />}
                onClick={() => handleChangeRole(user)}
              >
                Change Role
              </MenuItem>
            )}
            <MenuItem icon={<FiUser />}>View Profile</MenuItem>
            <MenuItem icon={<FiEdit />}>Edit User</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );

  const displayUsers =
    searchResults.length > 0
      ? (searchResults as UserPublicDto[])
      : usersData.items;

  return (
    <VStack spacing={6} align="stretch">
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber color="blue.500">{totalUsers}</StatNumber>
              <StatHelpText>Registered users</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Current Page</StatLabel>
              <StatNumber color="purple.500">
                {usersData.currentPage}
              </StatNumber>
              <StatHelpText>of {usersData.totalPages} pages</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Page Size</StatLabel>
              <StatNumber color="green.500">{usersData.pageSize}</StatNumber>
              <StatHelpText>Users per page</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Showing</StatLabel>
              <StatNumber color="orange.500">
                {usersData.items.length}
              </StatNumber>
              <StatHelpText>of {usersData.totalCount} total</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Search and Filter */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <HStack spacing={2}>
              <FiFilter />
              <Text fontWeight="bold">Search & Filter</Text>
            </HStack>
            <Button size="sm" variant="ghost" onClick={handleResetFilter}>
              Reset
            </Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">Search Users</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Username or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="sm"
                />
              </InputGroup>
              {isSearching && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Searching...
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Role</FormLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                size="sm"
                placeholder="All roles"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Page Size</FormLabel>
              <Select
                value={filter.pageSize}
                onChange={(e) =>
                  updateFilter({ pageSize: parseInt(e.target.value) })
                }
                size="sm"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </Select>
            </FormControl>

            <VStack spacing={2} align="stretch">
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleFilter}
                isDisabled={!searchTerm.trim() && !roleFilter}
              >
                Apply Filter
              </Button>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Search Results Info */}
      {searchResults.length > 0 && (
        <Alert status="info">
          <AlertIcon />
          <Text>
            Showing {searchResults.length} search result(s) for "{searchTerm}"
          </Text>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              clearSearch();
            }}
            ml={2}
          >
            Clear
          </Button>
        </Alert>
      )}

      {/* Users Table */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <Text fontWeight="bold">Users</Text>
            <Text fontSize="sm" color="gray.600">
              {searchResults.length > 0
                ? `${searchResults.length} search results`
                : `${usersData.items.length} of ${usersData.totalCount} users`}
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          {displayUsers.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">No users found</Text>
                <Text>
                  {searchTerm
                    ? `No users match your search "${searchTerm}"`
                    : "No users match your current filters"}
                </Text>
              </VStack>
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Joined</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {displayUsers.map((user: UserPublicDto) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {searchResults.length === 0 && usersData.totalPages > 1 && (
        <HStack justify="center" spacing={4}>
          <Button
            size="sm"
            onClick={() => goToPage(Math.max(1, usersData.currentPage - 1))}
            isDisabled={usersData.currentPage === 1}
          >
            Previous
          </Button>

          <HStack spacing={1}>
            {Array.from(
              { length: Math.min(5, usersData.totalPages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === usersData.currentPage ? "solid" : "ghost"}
                    colorScheme={
                      page === usersData.currentPage ? "blue" : "gray"
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                );
              }
            )}
          </HStack>

          <Button
            size="sm"
            onClick={() =>
              goToPage(
                Math.min(usersData.totalPages, usersData.currentPage + 1)
              )
            }
            isDisabled={usersData.currentPage === usersData.totalPages}
          >
            Next
          </Button>
        </HStack>
      )}

      {/* Change Role Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={onRoleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change User Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedUser && (
                <Alert status="info">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      Changing role for: {selectedUser.username}
                    </Text>
                    <Text fontSize="sm">
                      Current role: {getRoleLabel(selectedUser.role)}
                    </Text>
                  </VStack>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>New Role</FormLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Select new role"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Administrator</option>
                </Select>
              </FormControl>

              <Alert status="warning" size="sm">
                <AlertIcon />
                <Text fontSize="sm">
                  Role changes take effect immediately and may affect the user's
                  access to different parts of the platform.
                </Text>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRoleModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={confirmRoleChange}
              isDisabled={
                !newRole ||
                !isValidRole(newRole) ||
                newRole === selectedUser?.role
              }
              isLoading={isChangingRole}
            >
              Change Role
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
