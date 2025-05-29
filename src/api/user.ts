import API from "./axios";
import type {
  UserRegisterDto,
  UserLoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserProfileUpdateDto,
  UserPublicDto,
  UserProfileReadDto,
  ChangeUserRoleDto,
  UserFilterDto,
} from "../types/User";
import type { KDomDisplayDto } from "../types/KDom";
import type { PagedResult } from "../types/Pagination";

// Auth
export const register = async (data: UserRegisterDto): Promise<void> => {
  await API.post("/auth/register", data);
};

export const login = async (data: UserLoginDto): Promise<{ token: string }> => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const changePassword = async (
  data: ChangePasswordDto
): Promise<void> => {
  await API.put("/auth/change-password", data);
};

export const forgotPassword = async (
  data: ForgotPasswordDto
): Promise<void> => {
  await API.post("/auth/forgot-password", data);
};

export const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
  await API.post("/auth/reset-password", data);
};

// Profile
export const getUserProfile = async (
  id: number
): Promise<UserProfileReadDto> => {
  const res = await API.get(`/users/${id}/profile`);
  return res.data;
};

export const updateUserProfile = async (
  data: UserProfileUpdateDto
): Promise<void> => {
  await API.put("/users/profile", data);
};

export const getProfileThemes = async (): Promise<string[]> => {
  const res = await API.get("/users/profile/themes");
  return res.data;
};

// Management
export const changeUserRole = async (
  userId: number,
  data: ChangeUserRoleDto
): Promise<void> => {
  await API.patch(`/users/${userId}/role`, data);
};

export const getUsersPaginated = async (
  filters: UserFilterDto
): Promise<PagedResult<UserPublicDto>> => {
  const res = await API.get("/users", { params: filters });
  return res.data;
};

// KDom asociat user
export const getUserKdoms = async (
  userId: number
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/users/${userId}/kdoms`);
  return res.data;
};

export const getRecentlyViewedKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/users/recently-viewed-kdoms");
  return res.data;
};
