// src/types/community.ts
export interface KDom {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface Post {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  // adaugă alte câmpuri după modelul din backend:
  // images?: string[];
  // kdomName?: string;
}
