import { Map } from 'immutable';

export const INITIAL_STATE = Map({
  posts: [],
  currentPost: {
    postId: null,
    post: {},
    comments: [],
  },

  getPostsLoading: false,
  getPostsError: null,

  getCurrentPostDataLoading: false,
  getCurrentPostDataError: null,

  createPostLoading: false,
  createPostError: null,

  deletePostState: {}
});