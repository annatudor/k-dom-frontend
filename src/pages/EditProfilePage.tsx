// src/pages/EditProfilePage.tsx - FIXED VERSION
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Box,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  CardHeader,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FiArrowLeft, FiLock, FiShield } from "react-icons/fi"; // ✅ Removed FiSave
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyProfile } from "@/hooks/useUserProfile";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { changePassword } from "@/api/user";
import type { ChangePasswordDto } from "@/types/User";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ✅ STEP 2: Replace react-hook-form with native React state
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<ChangePasswordFormData>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profile, isLoading, error } = useMyProfile();

  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to edit your profile.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="blue.500" />
          <Box textAlign="center">Loading profile...</Box>
        </VStack>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              Could not load your profile. Please try again.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  const handleProfileUpdateSuccess = () => {
    navigate("/profile");
  };

  const handleCancelEdit = () => {
    navigate("/profile");
  };

  // ✅ STEP 3: Fix the input change handler with proper typing
  const handleInputChange = (
    field: keyof ChangePasswordFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // ✅ STEP 4: Add form validation function
  const validateForm = (): boolean => {
    const errors: Partial<ChangePasswordFormData> = {};

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(
        formData.newPassword
      )
    ) {
      errors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ STEP 5: Update form submission handler
  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsChangingPassword(true);

    try {
      const changePasswordData: ChangePasswordDto = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await changePassword(changePasswordData);

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFormErrors({});
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to change password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setIsChangingPassword(false);
    }
  };

  const clearForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFormErrors({});
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={4} align="stretch">
            <Breadcrumb spacing="8px" fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to="/profile">
                  Profile
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Edit</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <HStack justify="space-between" align="center">
              <Heading size="lg">Edit Profile</Heading>
              <Button
                as={RouterLink}
                to="/profile"
                leftIcon={<Icon as={FiArrowLeft} />}
                variant="ghost"
                size="sm"
              >
                Back to Profile
              </Button>
            </HStack>
          </VStack>

          {/* Edit Profile Form */}
          <EditProfileForm
            profile={profile}
            onCancel={handleCancelEdit}
            onSuccess={handleProfileUpdateSuccess}
          />

          {/* Security Section Divider */}
          <Box py={4}>
            <Divider />
            <HStack justify="center" mt={-3}>
              <Badge
                colorScheme="orange"
                px={4}
                py={2}
                borderRadius="full"
                bg={cardBg}
                fontWeight="bold"
              >
                <HStack spacing={2}>
                  <Icon as={FiShield} />
                  <Text>Security Settings</Text>
                </HStack>
              </Badge>
            </HStack>
          </Box>

          {/* Change Password Section */}
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
          >
            <CardHeader>
              <HStack spacing={3}>
                <Icon as={FiLock} color="orange.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="bold">
                    Change Password
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Keep your account secure by updating your password regularly
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>

            <CardBody>
              <form onSubmit={handleSubmitPasswordChange}>
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={!!formErrors.currentPassword}>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                    />
                    <FormErrorMessage>
                      {formErrors.currentPassword}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!formErrors.newPassword}>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                    />
                    <FormErrorMessage>
                      {formErrors.newPassword}
                    </FormErrorMessage>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Password must be at least 8 characters with uppercase,
                      lowercase, number, and symbol
                    </Text>
                  </FormControl>

                  <FormControl isInvalid={!!formErrors.confirmPassword}>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                    />
                    <FormErrorMessage>
                      {formErrors.confirmPassword}
                    </FormErrorMessage>
                  </FormControl>

                  <Alert status="info" borderRadius="lg" fontSize="sm">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">
                        Password Security Tips
                      </AlertTitle>
                      <AlertDescription>
                        Use a unique password that you don't use for other
                        accounts. Consider using a password manager to generate
                        and store secure passwords.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <HStack spacing={4} pt={4}>
                    <Button
                      type="submit"
                      colorScheme="orange"
                      leftIcon={<Icon as={FiLock} />}
                      isLoading={isSubmitting || isChangingPassword}
                      loadingText="Changing Password..."
                      flex="1"
                    >
                      Change Password
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearForm}
                      disabled={isSubmitting || isChangingPassword}
                      flex="1"
                    >
                      Clear Form
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Back to Profile Button */}
          <HStack justify="center" pt={4}>
            <Button
              as={RouterLink}
              to="/profile"
              variant="ghost"
              leftIcon={<Icon as={FiArrowLeft} />}
              size="lg"
            >
              Return to Profile
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
