// src/api/kdomDiscussion.ts - FIXED VERSION
import API from "./axios";
import type {
  KDomDiscussionReadDto,
  KDomDiscussionStatsDto,
  KDomDiscussionFilterDto,
  KDomDiscussionSearchDto,
} from "../types/KDomDiscussion";

/**
 * Obține discussion-ul complet pentru un K-Dom
 */
export const getKDomDiscussion = async (
  slug: string,
  filter: KDomDiscussionFilterDto = { page: 1, pageSize: 20 }
): Promise<KDomDiscussionReadDto> => {
  console.log(
    `[API] getKDomDiscussion called with slug: "${slug}", filter:`,
    filter
  );

  try {
    const response = await API.get(`/kdoms/slug/${slug}/discussion`, {
      params: filter,
    });

    console.log(`[API] getKDomDiscussion response:`, response.data);

    // ✅ FIX: Verifică structura răspunsului
    if (!response.data) {
      throw new Error("No data received from server");
    }

    // ✅ FIX: Asigură-te că toate proprietățile există
    const result: KDomDiscussionReadDto = {
      kdom: response.data.kdom || {
        id: "",
        title: "Unknown K-Dom",
        slug: slug,
        description: "",
        authorUsername: "Unknown",
        followersCount: 0,
      },
      posts: response.data.posts || {
        items: [],
        totalCount: 0,
        pageSize: filter.pageSize || 20,
        currentPage: filter.page || 1,
        totalPages: 0,
      },
      stats: response.data.stats || {
        totalPosts: 0,
        totalComments: 0,
        uniquePosterCount: 0,
        lastPostDate: null,
        firstPostDate: null,
      },
    };

    console.log(`[API] getKDomDiscussion processed result:`, result);
    return result;
  } catch (error) {
    console.error(`[API] getKDomDiscussion error:`, error);
    throw error;
  }
};

/**
 * Obține doar statisticile discussion-ului
 */
export const getKDomDiscussionStats = async (
  slug: string
): Promise<KDomDiscussionStatsDto> => {
  console.log(`[API] getKDomDiscussionStats called with slug: "${slug}"`);

  try {
    const response = await API.get(`/kdoms/slug/${slug}/discussion/stats`);
    console.log(`[API] getKDomDiscussionStats response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] getKDomDiscussionStats error:`, error);
    throw error;
  }
};

/**
 * Verifică dacă un K-Dom are discussion activ
 */
export const hasActiveDiscussion = async (
  slug: string
): Promise<{ hasActiveDiscussion: boolean; message: string }> => {
  console.log(`[API] hasActiveDiscussion called with slug: "${slug}"`);

  try {
    const response = await API.get(`/kdoms/slug/${slug}/has-discussion`);
    console.log(`[API] hasActiveDiscussion response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] hasActiveDiscussion error:`, error);
    throw error;
  }
};

/**
 * Caută în discussion-ul unui K-Dom
 */
export const searchKDomDiscussion = async (
  slug: string,
  searchParams: KDomDiscussionSearchDto
): Promise<KDomDiscussionReadDto> => {
  console.log(
    `[API] searchKDomDiscussion called with slug: "${slug}", params:`,
    searchParams
  );

  try {
    const response = await API.get(`/kdoms/slug/${slug}/discussion/search`, {
      params: searchParams,
    });

    console.log(`[API] searchKDomDiscussion response:`, response.data);

    // ✅ FIX: Ia datele din response.data.results (conform controller-ului)
    const searchResults = response.data.results || response.data;

    // ✅ FIX: Asigură-te că structura este corectă
    const result: KDomDiscussionReadDto = {
      kdom: searchResults.kdom || {
        id: "",
        title: "Unknown K-Dom",
        slug: slug,
        description: "",
        authorUsername: "Unknown",
        followersCount: 0,
      },
      posts: searchResults.posts || {
        items: [],
        totalCount: 0,
        pageSize: searchParams.pageSize || 20,
        currentPage: searchParams.page || 1,
        totalPages: 0,
      },
      stats: searchResults.stats || {
        totalPosts: 0,
        totalComments: 0,
        uniquePosterCount: 0,
        lastPostDate: null,
        firstPostDate: null,
      },
    };

    console.log(`[API] searchKDomDiscussion processed result:`, result);
    return result;
  } catch (error) {
    console.error(`[API] searchKDomDiscussion error:`, error);
    throw error;
  }
};

/**
 * Obține postările unui K-Dom (pentru backward compatibility)
 */
export const getKDomPosts = async (
  slug: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  kdom: {
    id: string;
    title: string;
    slug: string;
    description: string;
  };
  posts: unknown;
  pagination: Record<string, unknown>;
}> => {
  console.log(
    `[API] getKDomPosts called with slug: "${slug}", page: ${page}, pageSize: ${pageSize}`
  );

  try {
    const response = await API.get(`/kdoms/slug/${slug}/posts`, {
      params: { page, pageSize },
    });

    console.log(`[API] getKDomPosts response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API] getKDomPosts error:`, error);
    throw error;
  }
};
