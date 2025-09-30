'use server';

import { cookies } from 'next/headers';

export async function toggleCommentLike(commentId: string) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      throw new Error('Please login to like comments');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        targetId: commentId,
        targetType: 'comment',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle like');
    }

    return { 
      success: true, 
      liked: data.data.liked || data.liked,
      likesCount: data.data.likesCount || data.likesCount 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteComment(commentId: string, postSlug?: string) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      throw new Error('Please login to delete comments');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete comment');
    }
    
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkCommentLiked(commentId: string) {
  try {
    const accessToken = (await cookies()).get('accessToken')?.value;
    if (!accessToken) {
      return { success: true, liked: false };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/likes/check/${commentId}?targetType=comment`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return { success: true, liked: false };
    }
    
    const data = await response.json();
    return { success: true, liked: data.data || false };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: true, liked: false };
  }
}