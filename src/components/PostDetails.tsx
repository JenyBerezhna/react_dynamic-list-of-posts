import React from 'react';
import { Loader } from './Loader';
import { Post } from '../types/Post';
import { Comment, CommentData } from '../types/Comment';
import { NewCommentSection } from './NewCommentSection';

export interface Props {
  post: Post;
  comments: Comment[];
  loading: boolean;
  error: boolean;
  onAddComment: (comment: CommentData) => Promise<Comment>;
  onDeleteComment: (id: number) => Promise<void>;
}

export const PostDetails: React.FC<Props> = ({
  post,
  comments,
  loading,
  error,
  onAddComment,
  onDeleteComment,
}) => {
  const [localComments, setLocalComments] = React.useState(comments);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [addError, setAddError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Add comment with retry support
  const handleAddComment = async (data: CommentData) => {
    setAddError(null);

    try {
      const newComment = await onAddComment(data);

      setLocalComments(prev => [...prev, newComment]);
    } catch (err) {
      setAddError('Failed to add comment. Please try again.');
      throw err; // allows form to stop loading
    }
  };

  //  delete with rollback + retry support
  const handleDeleteComment = async (id: number) => {
    setDeleteError(null);

    const prevComments = localComments;

    setLocalComments(prev => prev.filter(c => c.id !== id));

    try {
      await onDeleteComment(id);
    } catch (err) {
      setLocalComments(prevComments);
      setDeleteError('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">
          #{post.id}: {post.title}
        </h2>

        <p data-cy="PostBody">{post.body}</p>
      </div>

      <div className="block">
        <h3 className="title is-4">Comments:</h3>

        {loading && <Loader />}

        {error && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong loading comments
          </div>
        )}

        {deleteError && (
          <div className="notification is-danger mt-2">{deleteError}</div>
        )}

        {addError && (
          <div className="notification is-danger mt-2">{addError}</div>
        )}

        {!loading && !error && localComments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!loading && !error && localComments.length > 0 && (
          <>
            {localComments.map(comment => (
              <article
                key={comment.id}
                className="message is-small"
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>
                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  />
                </div>
                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        <NewCommentSection onAddComment={handleAddComment} />
      </div>
    </div>
  );
};
