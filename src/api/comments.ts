import { client } from '../utils/fetchClient';
import { Comment, CommentData } from '../types/Comment';

export const commentsPost = (data: CommentData) => {
  return client.post<Comment>('/comments', data);
};
