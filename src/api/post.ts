import API from "./axios";
import type {
  PostCreateDto,
  PostEditDto,
  PostLikeResponseDto,
  PostReadDto,
} from "../types/Post";

//  Creează o postare (tags generate automat în backend)
export const createPost = async (data: PostCreateDto): Promise<void> => {
  await API.post("/posts", data);
};

//  Editează o postare (frontend trimite tags)
export const updatePost = async (
  postId: string,
  data: PostEditDto
): Promise<void> => {
  await API.put(`/posts/${postId}`, data);
};

//  Feed personalizat pentru user logat
export const getFeed = async (): Promise<PostReadDto[]> => {
  const res = await API.get("/posts/feed");
  return res.data;
};

//  Feed public pentru guests
export const getPublicFeed = async (): Promise<PostReadDto[]> => {
  const res = await API.get("/posts/public");
  return res.data;
};

//  Postare după ID
export const getPostById = async (id: string): Promise<PostReadDto> => {
  const res = await API.get(`/posts/${id}`);
  return res.data;
};

//  Postări ale unui user
export const getPostsByUserId = async (
  userId: number
): Promise<PostReadDto[]> => {
  const res = await API.get(`/posts/by-user/${userId}`);
  return res.data;
};

//  Postări după tag (ex: #blackpink)
export const getPostsByTag = async (tag: string): Promise<PostReadDto[]> => {
  const res = await API.get(`/posts/by-tag`, {
    params: { tag },
  });
  return res.data;
};

// Toggle like/unlike
export const toggleLikePost = async (
  postId: string
): Promise<PostLikeResponseDto> => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data;
};
