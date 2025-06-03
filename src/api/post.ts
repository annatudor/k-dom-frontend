// src/api/post.ts - Updated for rollback
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

//  Șterge o postare
export const deletePost = async (postId: string): Promise<void> => {
  await API.delete(`/posts/${postId}`);
};

//  Toate postările (pentru pagina principală de posts)
export const getAllPosts = async (): Promise<PostReadDto[]> => {
  const res = await API.get("/posts");
  return res.data;
};

//  Feed personalizat pentru user logat
export const getFeed = async (): Promise<PostReadDto[]> => {
  const res = await API.get("/posts/feed");
  return res.data;
};

//  Feed public pentru guests - FIXED endpoint name
export const getPublicFeed = async (): Promise<PostReadDto[]> => {
  const res = await API.get("/posts/guest-feed");
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
  const res = await API.get(`/posts/user/${userId}`);
  return res.data;
};

//  Postări după tag (ex: #blackpink)
export const getPostsByTag = async (tag: string): Promise<PostReadDto[]> => {
  const res = await API.get(`/posts/by-tag`, {
    params: { tag },
  });
  return res.data;
};

// Toggle like/unlike - FIXED: Use POST method
export const toggleLikePost = async (
  postId: string
): Promise<PostLikeResponseDto> => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data;
};
