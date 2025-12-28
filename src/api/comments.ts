import { client } from '../utils/fetchClient';
import { Comment, CommentData } from '../types/Comment';

export const commentsPost = (data: CommentData): Promise<Comment> => {
  return client.post('/comments', data);
};
