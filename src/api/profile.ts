// src/api/profile.ts
import API from "./axios";
import type {
  UserProfileData,
  UserProfileStats,
  UserProfileActivity,
  UserFollowData,
  UserKDomData,
  ProfileTabData,
} from "../types/Profile";
import type { UserProfileUpdateDto } from "../types/User";
import type { ProfileTheme } from "../types/Profile";

// === PROFILE DATA APIs ===

// Obține datele complete ale profilului (PUBLIC - oricine poate vedea)
export const getUserProfile = async (
  userId: number
): Promise<UserProfileData> => {
  const res = await API.get(`/users/${userId}/profile`);
  return res.data;
};

// Obține propriul profil (utilizatorul autentificat)
export const getMyProfile = async (): Promise<UserProfileData> => {
  const res = await API.get("/profile/my-profile");
  return res.data;
};

// Obține statisticile detaliate
export const getUserProfileStats = async (
  userId: number
): Promise<UserProfileStats> => {
  // TODO: Implementa endpoint-ul pentru statistici în backend
  const res = await API.get(`/users/${userId}/profile/stats`);
  return res.data;
};

// Obține activitatea recentă
export const getUserActivity = async (
  userId: number,
  limit = 20
): Promise<UserProfileActivity[]> => {
  // TODO: Implementa endpoint-ul pentru activitate în backend
  const res = await API.get(`/users/${userId}/activity`, {
    params: { limit },
  });
  return res.data;
};

// === FOLLOW APIs (folosesc endpoint-urile existente) ===

// Obține urmăritorii
export const getUserFollowers = async (
  userId: number
): Promise<UserFollowData[]> => {
  const res = await API.get(`/follow/followers/${userId}`);
  return res.data;
};

// Obține utilizatorii urmăriți
export const getUserFollowing = async (
  userId: number
): Promise<UserFollowData[]> => {
  const res = await API.get(`/follow/following/${userId}`);
  return res.data;
};

// === K-DOM APIs (folosesc endpoint-urile corecte) ===

// Obține K-Doms-urile utilizatorului (PUBLIC)
export const getUserKdoms = async (userId: number): Promise<UserKDomData[]> => {
  const res = await API.get(`/users/${userId}/kdoms`);
  return res.data;
};

// Obține propriile K-Doms-uri (utilizatorul autentificat)
export const getMyKdoms = async (): Promise<UserKDomData[]> => {
  const res = await API.get("/profile/my-kdoms");
  return res.data;
};

// Obține K-Doms-urile urmărite de utilizatorul curent
export const getUserFollowedKdoms = async (): Promise<UserKDomData[]> => {
  const res = await API.get("/kdoms/followed");
  return res.data;
};

// Obține K-Doms-urile vizionate recent (doar pentru utilizatorul curent)
export const getRecentlyViewedKdoms = async (): Promise<UserKDomData[]> => {
  const res = await API.get("/profile/recently-viewed-kdoms");
  return res.data;
};

// === PROFILE UPDATE APIs ===

// Actualizează propriul profil
export const updateMyProfile = async (
  data: UserProfileUpdateDto
): Promise<void> => {
  await API.put("/profile/edit-profile", data);
};

// Actualizează profilul ca admin (doar pentru administratori)
export const updateUserProfileAsAdmin = async (
  userId: number,
  data: UserProfileUpdateDto
): Promise<void> => {
  await API.put(`/admin/users/${userId}/profile`, data);
};

// === HELPER FUNCTIONS ===

// Funcție helper care determină ce endpoint să folosească pentru profil
export const getProfileForUser = async (
  userId?: number
): Promise<UserProfileData> => {
  if (userId) {
    // Profilul unui alt utilizator (public)
    return getUserProfile(userId);
  } else {
    // Propriul profil
    return getMyProfile();
  }
};

// Funcție helper care determină ce endpoint să folosească pentru K-Doms
export const getKDomsForUser = async (
  userId?: number
): Promise<UserKDomData[]> => {
  if (userId) {
    // K-Doms-urile unui alt utilizator (public)
    return getUserKdoms(userId);
  } else {
    // Propriile K-Doms-uri
    return getMyKdoms();
  }
};

// Funcție helper pentru actualizarea profilului
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

// === COMBINED DATA APIs ===

// Obține toate datele pentru profile tabs
export const getProfileTabData = async (
  userId?: number
): Promise<ProfileTabData> => {
  // Determină dacă e propriul profil sau al altcuiva
  const isOwnProfile = !userId;

  try {
    const [activity, kdoms, posts, following] = await Promise.all([
      getUserActivity(userId || 0, 10), // TODO: Implementa în backend
      getKDomsForUser(userId),
      API.get(userId ? `/posts/user/${userId}` : "/posts/user/me").then(
        (res) => res.data
      ),
      Promise.all([
        userId ? getUserFollowing(userId) : getUserFollowing(0), // TODO: Fix pentru propriul profil
        isOwnProfile ? getUserFollowedKdoms() : Promise.resolve([]),
      ]),
    ]);

    // Separăm K-Doms-urile owned vs collaborated
    const ownedKdoms = kdoms.filter((k) => k.role === "owner" || !k.role);
    const collaboratedKdoms = kdoms.filter((k) => k.role === "collaborator");

    return {
      overview: {
        recentActivity: activity.slice(0, 5),
        topKdoms: ownedKdoms.slice(0, 3),
        recentPosts: posts.slice(0, 3),
      },
      kdoms: {
        owned: ownedKdoms,
        collaborated: collaboratedKdoms,
      },
      posts,
      activity,
      following: {
        users: following[0],
        kdoms: following[1],
      },
    };
  } catch (error) {
    console.error("Error fetching profile tab data:", error);
    // Returnează date goale în caz de eroare
    return {
      overview: {
        recentActivity: [],
        topKdoms: [],
        recentPosts: [],
      },
      kdoms: {
        owned: [],
        collaborated: [],
      },
      posts: [],
      activity: [],
      following: {
        users: [],
        kdoms: [],
      },
    };
  }
};

// Verifică dacă utilizatorul curent urmărește acest profil
export const checkIfFollowing = async (userId: number): Promise<boolean> => {
  try {
    // TODO: Implementa un endpoint specific pentru verificarea follow status
    const following = await getUserFollowing(userId);
    return following.some((user) => user.isFollowedByCurrentUser);
  } catch {
    return false;
  }
};

// === THEME APIs ===

// Obține temele disponibile pentru profil
export const getProfileThemes = async (): Promise<string[]> => {
  const res = await API.get("/profile/themes");
  return res.data;
};

// === LEGACY COMPATIBILITY ===
// Păstrează funcția veche pentru compatibilitate, dar redirectează către noua implementare

/**
 * @deprecated Folosește updateMyProfile() sau updateUserProfileAsAdmin() în schimb
 */
export const updateUserProfile = async (data: {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
  profileTheme?: string;
}): Promise<void> => {
  console.warn(
    "updateUserProfile() is deprecated. Use updateMyProfile() instead."
  );

  const updateData: UserProfileUpdateDto = {
    nickname: data.nickname || "",
    bio: data.bio || "",
    avatarUrl: data.avatarUrl || "",
    profileTheme:
      (data.profileTheme as ProfileTheme) || ("Default" as ProfileTheme),
  };

  return updateMyProfile(updateData);
};
