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
  onAddComment?: (comment: CommentData) => void;
}

export const PostDetails: React.FC<Props> = ({
  post,
  comments,
  loading,
  error,
  onAddComment,
}) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const openForm = () => setIsFormOpen(true);

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

        {!loading && !error && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {!loading && !error && comments.length > 0 && (
          <>
            {comments.map(comment => (
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
                  >
                    delete button
                  </button>
                </div>
                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {!isFormOpen && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={openForm}
          >
            Write a comment
          </button>
        )}
      </div>

      <NewCommentSection onAddComment={onAddComment} />
    </div>
  );
};
