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

// Auth APIs (rămân la /auth)
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

// ✅ FIXAT: PROFILE APIs (pentru utilizatorul curent) - Corectez endpoint-urile
// Endpoint-uri pentru profilul utilizatorului autentificat

export const getMyProfile = async (): Promise<UserProfileReadDto> => {
  const res = await API.get("/profile/my-profile"); // ✅ FIXAT: era "/profile", acum "/profile/my-profile"
  return res.data;
};

export const updateMyProfile = async (
  data: UserProfileUpdateDto
): Promise<void> => {
  await API.put("/profile/edit-profile", data); // ✅ FIXAT: era "/profile", acum "/profile/edit-profile"
};

export const getProfileThemes = async (): Promise<string[]> => {
  const res = await API.get("/profile/themes");
  return res.data;
};

export const getMyKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/profile/my-kdoms");
  return res.data;
};

export const getRecentlyViewedKdoms = async (): Promise<KDomDisplayDto[]> => {
  const res = await API.get("/profile/recently-viewed-kdoms");
  return res.data;
};

// ✅ NOU: Adaug endpoint-urile lipsă din controller
export const getMyPrivateInfo = async (): Promise<unknown> => {
  const res = await API.get("/profile/private");
  return res.data;
};

export const addRecentlyViewedKdom = async (kdomId: string): Promise<void> => {
  await API.post(`/profile/recently-viewed/${kdomId}`);
};

export const canUpdateProfile = async (
  targetUserId: number
): Promise<{ canUpdate: boolean }> => {
  const res = await API.get(`/profile/can-update/${targetUserId}`);
  return res.data;
};

export const getMyDetailedStats = async (): Promise<unknown> => {
  const res = await API.get("/profile/detailed-stats");
  return res.data;
};

export const isCurrentUserAdmin = async (): Promise<{ isAdmin: boolean }> => {
  const res = await API.get("/profile/is-admin");
  return res.data;
};

export const isCurrentUserAdminOrModerator = async (): Promise<{
  isAdminOrModerator: boolean;
}> => {
  const res = await API.get("/profile/is-admin-or-moderator");
  return res.data;
};

export const getRecentlyViewedKDomIds = async (): Promise<{
  kdomIds: string[];
}> => {
  const res = await API.get("/profile/recently-viewed-ids");
  return res.data;
};

export const validateUpdatePermissions = async (
  targetUserId: number
): Promise<{ message: string }> => {
  const res = await API.post(
    `/profile/validate-update-permissions/${targetUserId}`
  );
  return res.data;
};

// === PUBLIC APIs (pentru vizualizarea profilurilor publice) ===
// Endpoint-uri pentru vizualizarea profilurilor altor utilizatori

export const getUserProfile = async (
  userId: number
): Promise<UserProfileReadDto> => {
  const res = await API.get(`/users/${userId}/profile`);
  return res.data;
};

export const getUserKdoms = async (
  userId: number
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/users/${userId}/kdoms`);
  return res.data;
};

// === ADMIN APIs (doar pentru administratori) ===
// Endpoint-uri pentru administrarea utilizatorilor

export const getAllUsers = async (
  filters: UserFilterDto
): Promise<PagedResult<UserPublicDto>> => {
  const res = await API.get("/admin/users", { params: filters });
  return res.data;
};

export const getAdminUserProfile = async (
  userId: number
): Promise<UserProfileReadDto> => {
  const res = await API.get(`/admin/users/${userId}/profile`);
  return res.data;
};

export const updateUserProfileAsAdmin = async (
  userId: number,
  data: UserProfileUpdateDto
): Promise<void> => {
  await API.put(`/admin/users/${userId}/profile`, data);
};

export const changeUserRole = async (
  userId: number,
  data: ChangeUserRoleDto
): Promise<void> => {
  await API.patch(`/admin/users/${userId}/role`, data);
};

export const getAdminUserKdoms = async (
  userId: number
): Promise<KDomDisplayDto[]> => {
  const res = await API.get(`/admin/users/${userId}/kdoms`);
  return res.data;
};

// === HELPER FUNCTIONS ===
// Funcții helper pentru determinarea endpoint-urilor corecte

export const getProfileForUser = async (
  userId?: number
): Promise<UserProfileReadDto> => {
  if (userId) {
    // Profilul unui alt utilizator (public)
    return getUserProfile(userId);
  } else {
    // Profilul utilizatorului curent
    return getMyProfile();
  }
};

export const updateProfileForUser = async (
  data: UserProfileUpdateDto,
  userId?: number
): Promise<void> => {
  if (userId) {
    // Actualizare ca admin
    return updateUserProfileAsAdmin(userId, data);
  } else {
    // Actualizare propriul profil
    return updateMyProfile(data);
  }
};
