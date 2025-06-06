// src/api/userAdmin.ts - API pentru administrarea utilizatorilor
import API from "./axios";
import type {
  UserPublicDto,
  UserFilterDto,
  ChangeUserRoleDto,
} from "@/types/User";
import type { PagedResult } from "@/types/Pagination";

// ========================================
// USER ADMIN OPERATIONS
// ========================================

/**
 * Obține lista paginată a utilizatorilor (admin only)
 */
export const getAllUsers = async (
  filter: UserFilterDto
): Promise<PagedResult<UserPublicDto>> => {
  const params = new URLSearchParams();

  if (filter.username) params.append("username", filter.username);
  if (filter.email) params.append("email", filter.email);
  if (filter.role) params.append("role", filter.role);
  params.append("page", filter.page.toString());
  params.append("pageSize", filter.pageSize.toString());

  const response = await API.get(`/admin/users?${params.toString()}`);
  return response.data;
};

/**
 * Schimbă rolul unui utilizator (admin only)
 */
export const changeUserRole = async (
  userId: number,
  data: ChangeUserRoleDto
): Promise<{ message: string }> => {
  const response = await API.patch(`/admin/users/${userId}/role`, data);
  return response.data;
};

/**
 * Obține profilul unui utilizator specific (admin only)
 */
export const getUserProfile = async (userId: number): Promise<unknown> => {
  const response = await API.get(`/admin/users/${userId}/profile`);
  return response.data;
};

/**
 * Obține K-Dom-urile create de un utilizator (admin only)
 */
export const getUserKdoms = async (userId: number): Promise<unknown[]> => {
  const response = await API.get(`/admin/users/${userId}/kdoms`);
  return response.data;
};

/**
 * Actualizează profilul unui utilizator (admin only)
 */
export const updateUserProfile = async (
  userId: number,
  data: unknown
): Promise<{ message: string }> => {
  const response = await API.put(`/admin/users/${userId}/profile`, data);
  return response.data;
};

/**
 * Obține informații private despre utilizator (admin only)
 */
export const getUserPrivateInfo = async (userId: number): Promise<unknown> => {
  const response = await API.get(`/admin/users/${userId}/private`);
  return response.data;
};

/**
 * Obține statistici detaliate despre utilizator (admin only)
 */
export const getUserDetailedStats = async (
  userId: number
): Promise<unknown> => {
  const response = await API.get(`/admin/users/${userId}/detailed-stats`);
  return response.data;
};

/**
 * Căutare rapidă utilizatori (admin only)
 */
export const quickSearchUsers = async (
  query: string,
  limit: number = 10
): Promise<{
  query: string;
  results: UserPublicDto[];
  count: number;
  message: string;
}> => {
  const response = await API.get(
    `/admin/users/search?query=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Validează dacă un rol este valid
 */
export const isValidRole = (role: string): boolean => {
  const validRoles = ["user", "moderator", "admin"];
  return validRoles.includes(role.toLowerCase());
};

/**
 * Obține culoarea pentru rol
 */
export const getRoleColor = (role: string): string => {
  switch (role.toLowerCase()) {
    case "admin":
      return "red";
    case "moderator":
      return "purple";
    case "user":
      return "blue";
    default:
      return "gray";
  }
};

/**
 * Obține label-ul pentru rol
 */
export const getRoleLabel = (role: string): string => {
  switch (role.toLowerCase()) {
    case "admin":
      return "Administrator";
    case "moderator":
      return "Moderator";
    case "user":
      return "User";
    default:
      return role;
  }
};

/**
 * Formatează data pentru afișare
 */
export const formatUserDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
