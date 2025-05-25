import {
  Avatar,
  Box,
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
import { useAuth } from "../hooks/useAuth";

export function AvatarDrawer() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) return null;

  return (
    <>
      <Avatar
        name={user.username}
        src={user.avatar}
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
              <Avatar src={user.avatar} name={user.username} />
              <Box fontWeight="bold">{user.username}</Box>
            </Stack>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={3} mt={4}>
              <Link as={RouterLink} to="/settings">
                My Preferences
              </Link>
              <Link as={RouterLink} to={`/profile/${user.id}`}>
                View Profile
              </Link>
              <Link as={RouterLink} to="/my-contributions">
                My Contributions
              </Link>
              <Link as={RouterLink} to="/create-post">
                Create a Post
              </Link>

              {["admin", "moderator"].includes(user.role) && (
                <>
                  <Divider />
                  <Box fontSize="sm" textTransform="uppercase" opacity={0.6}>
                    Admin
                  </Box>
                  <Link as={RouterLink} to="/admin/moderation">
                    Moderation
                  </Link>
                  <Link as={RouterLink} to="/admin/stats">
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
