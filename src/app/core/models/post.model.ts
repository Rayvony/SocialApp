export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  commentCount: number;
  createdAt: number;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
