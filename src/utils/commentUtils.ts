// src/utils/commentsUtils.ts

import type {
  CommentWithLikes,
  CommentWithReplies,
  CommentSortOption,
  CommentStats,
} from "@/types/CommentSystem";

/**
 * Organizează comentariile în structură ierarhică (parent-child)
 */
export function organizeComments(
  flatComments: CommentWithLikes[]
): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  // Primul pas: creează map-ul și inițializează replies
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
      replyCount: 0,
    });
  });

  // Al doilea pas: organizează ierarhia
  flatComments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parentCommentId) {
      // Este un reply
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
        parent.replyCount = (parent.replyCount || 0) + 1;
      }
    } else {
      // Este un comentariu principal
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

/**
 * Sortează comentariile după criteriul specificat
 */
export function sortComments(
  comments: CommentWithReplies[],
  sortBy: CommentSortOption
): CommentWithReplies[] {
  const sorted = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "mostLiked":
        return (b.likeCount || 0) - (a.likeCount || 0);

      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  // Sortează și replies-urile recursiv
  return sorted.map((comment) => ({
    ...comment,
    replies: comment.replies ? sortComments(comment.replies, sortBy) : [],
  }));
}

/**
 * Calculează statisticile comentariilor
 */
export function calculateCommentStats(
  comments: CommentWithReplies[]
): CommentStats {
  let totalReplies = 0;

  const countReplies = (commentList: CommentWithReplies[]): number => {
    return commentList.reduce((total, comment) => {
      const repliesCount = comment.replies?.length || 0;
      return (
        total +
        repliesCount +
        (comment.replies ? countReplies(comment.replies) : 0)
      );
    }, 0);
  };

  totalReplies = countReplies(comments);

  return {
    mainComments: comments.length,
    totalReplies,
    totalComments: comments.length + totalReplies,
  };
}

/**
 * Găsește un comentariu după ID în structura ierarhică
 */
export function findCommentById(
  comments: CommentWithReplies[],
  commentId: string
): CommentWithReplies | null {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }

    if (comment.replies) {
      const found = findCommentById(comment.replies, commentId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Actualizează un comentariu în structura ierarhică
 */
export function updateCommentInTree(
  comments: CommentWithReplies[],
  commentId: string,
  updates: Partial<CommentWithReplies>
): CommentWithReplies[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, ...updates };
    }

    if (comment.replies) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updates),
      };
    }

    return comment;
  });
}

/**
 * Elimină un comentariu din structura ierarhică
 */
export function removeCommentFromTree(
  comments: CommentWithReplies[],
  commentId: string
): CommentWithReplies[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: comment.replies
        ? removeCommentFromTree(comment.replies, commentId)
        : [],
    }));
}

/**
 * Formatează timpul relativ pentru comentarii
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Pentru date mai vechi, returnează data formatată
  return date.toLocaleDateString();
}

/**
 * Validează textul comentariului
 */
export function validateCommentText(
  text: string,
  maxLength: number = 2000
): { isValid: boolean; error?: string } {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return { isValid: false, error: "Comment cannot be empty" };
  }

  if (trimmedText.length > maxLength) {
    return {
      isValid: false,
      error: `Comment cannot exceed ${maxLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Detectează mențiuni în text (@username)
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Convertește mențiunile în link-uri
 */
export function renderMentions(text: string): string {
  return text.replace(
    /@(\w+)/g,
    '<a href="/profile/$1" class="mention">@$1</a>'
  );
}

/**
 * Găsește un comentariu în structura ierarhică
 */
export function findCommentInTree(
  comments: CommentWithReplies[],
  commentId: string
): CommentWithReplies | null {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }

    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentInTree(comment.replies, commentId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Calculează adâncimea maximă de reply-uri
 */
export function getMaxReplyDepth(comments: CommentWithReplies[]): number {
  let maxDepth = 0;

  const calculateDepth = (
    commentList: CommentWithReplies[],
    currentDepth: number
  ) => {
    commentList.forEach((comment) => {
      maxDepth = Math.max(maxDepth, currentDepth);
      if (comment.replies && comment.replies.length > 0) {
        calculateDepth(comment.replies, currentDepth + 1);
      }
    });
  };

  calculateDepth(comments, 1);
  return maxDepth;
}
