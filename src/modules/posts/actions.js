import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  getPosts: null,
  getPostsLoading: null,
  getPostsSuccess: ['posts'],
  getPostsFailure: ['error'],

  getCurrentPostData: ['postId'],
  getCurrentPostDataLoading: null,
  getCurrentPostDataSuccess: ['postId', 'post', 'comments'],
  getCurrentPostDataFailure: ['error'],

  createPost: ['data'],
  createPostLoading: null,
  createPostSuccess: null,
  createPostFailure: ['error'],

  deletePost: ['id'],
  deletePostLoading: ['id'],
  deletePostSuccess: ['id'],
  deletePostFailure: ['id, error'],
});

export const PostsTypes = Types;
export default Creators;