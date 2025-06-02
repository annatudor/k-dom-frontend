import { Button, Icon, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FiUserPlus, FiUserCheck, FiHeart } from "react-icons/fi";
import { useUserFollow } from "@/hooks/useUserFollow";
import type { ButtonProps } from "@chakra-ui/react";

interface FollowButtonProps extends Omit<ButtonProps, "onClick"> {
  userId: number;
  username?: string;
  variant?: "user" | "heart";
  showFollowerCount?: boolean;
}

export function FollowButton({
  userId,
  username,
  variant = "user",
  showFollowerCount = false,
  ...buttonProps
}: FollowButtonProps) {
  const {
    isFollowing,
    followersCount,
    handleToggleFollow,
    isLoading,
    canFollow,
  } = useUserFollow(userId);

  const followingBg = useColorModeValue("green.500", "green.600");
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
      icon: isFollowing ? FiUserCheck : FiUserPlus,
      text: isFollowing ? "Following" : "Follow",
      colorScheme: isFollowing ? "green" : "blue",
    };
  };

  const { icon, text, colorScheme } = getButtonContent();

  const followText = showFollowerCount ? `${text} (${followersCount})` : text;

  return (
    <Tooltip
      label={
        isFollowing
          ? `Unfollow ${username || "this user"}`
          : `Follow ${username || "this user"}`
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
        {followText}
      </Button>
    </Tooltip>
  );
}
