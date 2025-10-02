'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createPost(formData: {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    revalidatePath('/');
    revalidatePath('/tag/[tagName]', 'page');
    revalidatePath('/page/[pageNum]', 'page')
    revalidatePath('/dashboard');

    return { success: true, post: data };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, formData: {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update post');
    }

    revalidatePath('/');
    revalidatePath('/tag/[tagName]', 'page');
    revalidatePath('/page/[pageNum]', 'page')
    revalidatePath('/dashboard');
    revalidatePath(`/posts/${data.slug}`);

    return { success: true, post: data };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete post');
    }

    revalidatePath('/');
    revalidatePath('/tag/[tagName]', 'page');
    revalidatePath('/page/[pageNum]', 'page')
    revalidatePath('/dashboard');

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleLike(postId: string) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      throw new Error('Please login to like posts');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ targetId: postId, targetType: 'post' }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle like');
    }

    return { success: true, liked: data.liked, likesCount: data.likesCount };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function postComment(postId: string, content: string, parentId?: string) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      throw new Error('Please login to post a comment');
    }

    if (!content.trim()) {
      throw new Error('Please write a comment');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        post: postId,
        content,
        ...(parentId && { parentComment: parentId }),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to post comment');
    }

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePostStatus(id: string, status: 'draft' | 'published') {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      throw new Error('Please login to update post status');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update post status');
    }

    return { success: true, status };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadPostImage(postId: string, file: File) {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/posts/${postId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload image');
    }

    revalidatePath('/');
    revalidatePath('/dashboard');
    
    return { success: true, url: data.url, publicId: data.publicId };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}