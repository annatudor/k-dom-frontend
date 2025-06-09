import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AvatarDrawer() {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) return null;

  const isAdminOrModerator = user.role === "admin" || user.role === "moderator";

  return (
    <>
      <Avatar
        name={user.username}
        size="sm"
        cursor="pointer"
        onClick={onOpen}
      />

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Stack direction="row" align="center" spacing={4}>
              <Avatar name={user.username} />
              <Box fontWeight="bold">{user.username}</Box>
            </Stack>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={3} mt={4}>
              {/* My Preferences - link către Settings */}
              <Link
                as={RouterLink}
                to="/profile/edit"
                onClick={onClose}
                _hover={{ textDecoration: "none", color: "purple.500" }}
              >
                My Preferences
              </Link>

              {/* View Profile - link către profilul utilizatorului */}
              <Link
                as={RouterLink}
                to="/profile"
                onClick={onClose}
                _hover={{ textDecoration: "none", color: "purple.500" }}
              >
                View Profile
              </Link>

              {/* My Contributions - link către profilul utilizatorului cu tab-ul contributions */}
              <Link
                as={RouterLink}
                to="/user/moderation"
                onClick={onClose}
                _hover={{ textDecoration: "none", color: "purple.500" }}
              >
                My Contributions
              </Link>

              {/* Create a Post */}
              <Link
                as={RouterLink}
                to="/create-post"
                onClick={onClose}
                _hover={{ textDecoration: "none", color: "purple.500" }}
              >
                Create a Post
              </Link>

              {/* Logout Button */}
              <Button
                onClick={() => {
                  logout();
                  onClose();
                }}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>

              {/* Admin/Moderator Section */}
              {isAdminOrModerator && (
                <>
                  <Divider />
                  <Box
                    fontSize="sm"
                    textTransform="uppercase"
                    opacity={0.6}
                    fontWeight="bold"
                  >
                    {user.role === "admin" ? "Admin" : "Moderator"}
                  </Box>

                  {/* Moderation */}
                  <Link
                    as={RouterLink}
                    to="/admin/moderation"
                    onClick={onClose}
                    _hover={{ textDecoration: "none", color: "purple.500" }}
                  >
                    Moderation
                  </Link>

                  {/* Logs - doar pentru admin */}
                  {user.role === "admin" && (
                    <Link
                      as={RouterLink}
                      to="/admin/logs"
                      onClick={onClose}
                      _hover={{ textDecoration: "none", color: "purple.500" }}
                    >
                      Audit Logs
                    </Link>
                  )}

                  {/* Edit Home Page - doar pentru admin */}
                  {user.role === "admin" && (
                    <Link
                      as={RouterLink}
                      to="/admin/home-editor"
                      onClick={onClose}
                      _hover={{ textDecoration: "none", color: "purple.500" }}
                    >
                      Edit Home Page
                    </Link>
                  )}

                  {/* User Management - doar pentru admin */}
                  {user.role === "admin" && (
                    <Link
                      as={RouterLink}
                      to="/admin/users"
                      onClick={onClose}
                      _hover={{ textDecoration: "none", color: "purple.500" }}
                    >
                      User Management
                    </Link>
                  )}

                  {/* Statistics */}
                  <Link
                    as={RouterLink}
                    to="/admin/statistics"
                    onClick={onClose}
                    _hover={{ textDecoration: "none", color: "purple.500" }}
                  >
                    Statistics
                  </Link>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
