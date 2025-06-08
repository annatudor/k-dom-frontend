// src/components/profile/EditProfileForm.tsx - FIXED VERSION
import { useState } from "react";
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Text,
  useColorModeValue,
  useToast,
  FormErrorMessage,
  Box,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FiCamera, FiSave, FiX } from "react-icons/fi";
// Remove react-hook-form import - we'll use native React state instead
import { useUpdateProfile } from "@/hooks/useUserProfile";
import type {
  UserProfileUpdateDto,
  ProfileTheme,
  UserProfileReadDto,
} from "@/types/User";

interface EditProfileFormProps {
  profile: UserProfileReadDto;
  onCancel: () => void;
  onSuccess?: () => void;
}

interface ProfileFormData {
  nickname: string;
  bio: string;
  avatarUrl: string;
  profileTheme: ProfileTheme;
}

export function EditProfileForm({
  profile,
  onCancel,
  onSuccess,
}: EditProfileFormProps) {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Use React state instead of react-hook-form
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: profile.nickname || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    profileTheme: profile.profileTheme || "Default",
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const updateProfileMutation = useUpdateProfile();

  const profileThemes: {
    value: ProfileTheme;
    label: string;
    description: string;
  }[] = [
    {
      value: "Default",
      label: "Default",
      description: "Classic blue and purple gradient",
    },
    {
      value: "Cyber",
      label: "Cyber",
      description: "Futuristic purple and cyan",
    },
    {
      value: "Soft",
      label: "Soft",
      description: "Gentle pink and blue pastels",
    },
    {
      value: "Contrast",
      label: "Contrast",
      description: "High contrast black and gray",
    },
    {
      value: "Monochrome",
      label: "Monochrome",
      description: "Elegant grayscale",
    },
  ];

  const getThemeGradient = (theme: ProfileTheme) => {
    switch (theme) {
      case "Cyber":
        return "linear(to-r, purple.600, blue.600, cyan.400)";
      case "Soft":
        return "linear(to-r, pink.300, purple.300, blue.300)";
      case "Contrast":
        return "linear(to-r, black, gray.800, gray.600)";
      case "Monochrome":
        return "linear(to-r, gray.400, gray.600, gray.800)";
      default:
        return "linear(to-r, blue.500, purple.500, pink.500)";
    }
  };

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string | ProfileTheme
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (formData.nickname && formData.nickname.length > 50) {
      newErrors.nickname = "Display name cannot exceed 50 characters";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }

    if (formData.avatarUrl) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(formData.avatarUrl)) {
        newErrors.avatarUrl = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarUpload = async () => {
    setIsUploadingAvatar(true);

    // TODO: Implementează upload-ul cu Google Cloud Service
    toast({
      title: "Avatar Upload",
      description:
        "Avatar upload feature will be available soon with Google Cloud integration!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    setIsUploadingAvatar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: UserProfileUpdateDto = {
        nickname: formData.nickname.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        avatarUrl: formData.avatarUrl.trim() || undefined,
        profileTheme: formData.profileTheme,
      };

      await updateProfileMutation.mutateAsync(updateData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSuccess?.();
    } catch {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Check if form has changes
  const hasChanges =
    formData.nickname !== (profile.nickname || "") ||
    formData.bio !== (profile.bio || "") ||
    formData.avatarUrl !== (profile.avatarUrl || "") ||
    formData.profileTheme !== (profile.profileTheme || "Default");

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
    >
      <CardHeader>
        <Text fontSize="xl" fontWeight="bold">
          Edit Profile
        </Text>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Theme Preview */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={3} color="gray.600">
                Theme Preview
              </Text>
              <Box
                h="80px"
                bgGradient={getThemeGradient(formData.profileTheme)}
                borderRadius="lg"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  h="20px"
                  bgGradient="linear(to-t, white, transparent)"
                  opacity={0.8}
                />
              </Box>
            </Box>

            {/* Avatar Section */}
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <VStack spacing={4}>
                <Avatar
                  size="xl"
                  src={formData.avatarUrl}
                  name={profile.nickname || profile.username}
                />

                <VStack spacing={2}>
                  <Button
                    leftIcon={<Icon as={FiCamera} />}
                    onClick={handleAvatarUpload}
                    isLoading={isUploadingAvatar}
                    loadingText="Uploading..."
                    variant="outline"
                    size="sm"
                  >
                    Change Avatar
                  </Button>

                  <FormControl isInvalid={!!errors.avatarUrl}>
                    <Input
                      placeholder="Or paste image URL"
                      value={formData.avatarUrl}
                      onChange={(e) =>
                        handleInputChange("avatarUrl", e.target.value)
                      }
                      size="sm"
                    />
                    <FormErrorMessage>{errors.avatarUrl}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </VStack>
            </FormControl>

            <Divider />

            {/* Basic Information */}
            <FormControl isInvalid={!!errors.nickname}>
              <FormLabel>Display Name</FormLabel>
              <Input
                placeholder="Enter your display name"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
              />
              <FormErrorMessage>{errors.nickname}</FormErrorMessage>
              <Text fontSize="xs" color="gray.500" mt={1}>
                This is how your name will appear to other users
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.bio}>
              <FormLabel>Bio</FormLabel>
              <Textarea
                placeholder="Tell us about yourself..."
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
              <FormErrorMessage>{errors.bio}</FormErrorMessage>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formData.bio.length}/500 characters
              </Text>
            </FormControl>

            {/* Theme Selection */}
            <FormControl>
              <FormLabel>Profile Theme</FormLabel>
              <Select
                value={formData.profileTheme}
                onChange={(e) =>
                  handleInputChange(
                    "profileTheme",
                    e.target.value as ProfileTheme
                  )
                }
              >
                {profileThemes.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label} - {theme.description}
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Choose a theme that reflects your personality
              </Text>
            </FormControl>

            {/* Action Buttons */}
            <HStack spacing={4} pt={4}>
              <Button
                type="submit"
                colorScheme="blue"
                leftIcon={<Icon as={FiSave} />}
                isLoading={updateProfileMutation.isPending}
                loadingText="Saving..."
                isDisabled={!hasChanges}
                flex="1"
              >
                Save Changes
              </Button>

              <Button
                variant="outline"
                leftIcon={<Icon as={FiX} />}
                onClick={onCancel}
                flex="1"
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}
