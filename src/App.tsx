import { useEffect, useState } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { client } from './utils/fetchClient';
import { User } from './types/User';
import { Post } from './types/Post';
import { Comment, CommentData } from './types/Comment';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [usersError, setUsersError] = useState(false);
  const [postsError, setPostsError] = useState(false);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError(false);
        const data = await client.get<User[]>('/users');

        setUsers(data);
      } catch {
        setUsersError(true);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setPosts([]);

      return;
    }

    const loadPosts = async () => {
      try {
        setLoadingPosts(true);
        setPostsError(false);
        const data = await client.get<Post[]>(
          `/posts?userId=${selectedUser.id}`,
        );

        setPosts(data);
      } catch {
        setPostsError(true);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadPosts();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedPost) {
      setComments([]);

      return;
    }

    const loadComments = async () => {
      try {
        setLoadingComments(true);
        setCommentsError(false);
        const data = await client.get<Comment[]>(
          `/comments?postId=${selectedPost.id}`,
        );

        setComments(data);
      } catch {
        setCommentsError(true);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [selectedPost]);

  const handleAddComment = async (data: CommentData) => {
    try {
      setLoadingComments(true);
      setCommentsError(false);

      const created = await client.post<Comment>(
        `/comments?postId=${selectedPost?.id}`,
        { ...data, postId: selectedPost!.id },
      );

      setComments(prev => [...prev, created]);
    } catch {
      setCommentsError(true);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  selectedUser={selectedUser}
                  onSelect={setSelectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {loadingUsers && <Loader />}
                {usersError && (
                  <div className="notification is-danger">
                    Failed to load users
                  </div>
                )}

                {loadingPosts && <Loader />}
                {postsError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong loading posts!
                  </div>
                )}

                {selectedUser &&
                  !loadingPosts &&
                  !postsError &&
                  (posts.length > 0 ? (
                    <PostsList
                      posts={posts}
                      selectedPost={selectedPost}
                      onSelect={setSelectedPost}
                      onClose={() => setSelectedPost(null)}
                    />
                  ) : (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': !!selectedPost },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost ? (
                <PostDetails
                  post={selectedPost}
                  comments={comments}
                  loading={loadingComments}
                  error={commentsError}
                  onAddComment={handleAddComment}
                />
              ) : (
                <p>Select a post to see details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
