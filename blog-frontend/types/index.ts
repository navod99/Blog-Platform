export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: User;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  featuredImage?: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  replies?: Comment[];
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likesCount: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  posts?: T[];
  comments?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}