export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

// Only the fields the form collects
export type CommentData = Pick<Comment, 'name' | 'email' | 'body'>;
