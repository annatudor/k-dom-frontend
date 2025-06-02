// src/components/follow/KDomFollowButton.tsx
import {
  Button,
  Icon,
  Tooltip,
  useColorModeValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FiBookmark, FiCheck, FiHeart } from "react-icons/fi";
import { useKDomFollow } from "@/hooks/useKDomFollow";
import type { ButtonProps } from "@chakra-ui/react";

interface KDomFollowButtonProps extends Omit<ButtonProps, "onClick"> {
  kdomId: string;
  kdomTitle?: string;
  variant?: "bookmark" | "heart";
  showFollowerCount?: boolean;
  compact?: boolean;
}

export function KDomFollowButton({
  kdomId,
  kdomTitle,
  variant = "bookmark",
  showFollowerCount = false,
  compact = false,
  ...buttonProps
}: KDomFollowButtonProps) {
  const {
    isFollowing,
    followersCount,
    handleToggleFollow,
    isLoading,
    canFollow,
  } = useKDomFollow(kdomId);

  const followingBg = useColorModeValue("purple.500", "purple.600");
  const followingHoverBg = useColorModeValue("red.500", "red.600");

  if (!canFollow) {
    return null;
  }

  const getButtonContent = () => {
    if (variant === "heart") {
      return {
        icon: FiHeart,
        text: isFollowing ? "Following" : "Follow",
        colorScheme: isFollowing ? "red" : "gray",
      };
    }

    return {
      icon: isFollowing ? FiCheck : FiBookmark,
      text: isFollowing ? "Following" : "Follow",
      colorScheme: isFollowing ? "purple" : "blue",
    };
  };

  const { icon, text, colorScheme } = getButtonContent();

  if (compact) {
    return (
      <Tooltip
        label={
          isFollowing
            ? `Unfollow ${kdomTitle || "this K-Dom"}`
            : `Follow ${kdomTitle || "this K-Dom"}`
        }
        hasArrow
      >
        <Button
          size="sm"
          variant={isFollowing ? "solid" : "outline"}
          colorScheme={colorScheme}
          onClick={handleToggleFollow}
          isLoading={isLoading}
          bg={isFollowing ? followingBg : undefined}
          _hover={{
            bg: isFollowing ? followingHoverBg : undefined,
          }}
          {...buttonProps}
        >
          <Icon as={icon} />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      label={
        isFollowing
          ? `Unfollow ${kdomTitle || "this K-Dom"}`
          : `Follow ${kdomTitle || "this K-Dom"}`
      }
      hasArrow
    >
      <Button
        leftIcon={<Icon as={icon} />}
        colorScheme={colorScheme}
        variant={isFollowing ? "solid" : "outline"}
        onClick={handleToggleFollow}
        isLoading={isLoading}
        loadingText={isFollowing ? "Unfollowing..." : "Following..."}
        bg={isFollowing ? followingBg : undefined}
        _hover={{
          bg: isFollowing ? followingHoverBg : undefined,
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
        {...buttonProps}
      >
        <HStack spacing={2}>
          <Text>{text}</Text>
          {showFollowerCount && (
            <Text fontSize="sm" opacity={0.8}>
              ({followersCount})
            </Text>
          )}
        </HStack>
      </Button>
    </Tooltip>
  );
}
