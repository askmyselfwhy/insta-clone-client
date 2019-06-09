import { createReducer } from 'reduxsauce';

import { INITIAL_STATE } from './initialState';
import { PostsTypes } from './actions';
import { readAllData } from '../../utils/indexedDB';

export const getPostsLoading = (state) =>
  state.merge({
    getPostsLoading: true,
    getPostsError: null,
  })

export const getPostsSuccess = (state, { posts }) =>
  state.merge({
    posts,
    getPostsLoading: false,
  })

export const getPostsFailure = (state, { error }) => {
  const statePosts = state.get('posts');
  const dataFromIndexedDB = readAllData('posts');
  return state.merge({
    posts: statePosts || dataFromIndexedDB,
    getPostsLoading: false,
    getPostsError: error,
  })
}



export const getCurrentPostDataLoading = (state) =>
  state.merge({
    getCurrentPostDataLoading: true,
    getCurrentPostDataError: null,
  })

export const getCurrentPostDataSuccess = (state, { postId, post, comments }) =>
  state.merge({
    currentPost: {
      postId,
      post,
      comments,
    },
    getCurrentPostDataLoading: false,
  })

export const getCurrentPostDataFailure = (state, { error }) =>
  state.merge({
    getCurrentPostDataLoading: false,
    getCurrentPostDataError: error,
  })

export const createPostLoading = (state) =>
  state.merge({
    createPostLoading: true,
    createPostError: null,
  })

export const createPostSuccess = (state) =>
  state.merge({
    createPostLoading: false,
  })

export const createPostFailure = (state, { error }) =>
  state.merge({
    createPostLoading: false,
    createPostError: error,
  })


export const deletePostLoading = (state, { id }) =>
  state.merge({
    deletePostState: {
      ...state.get('deletePostState'),
      [id]: {
        loading: true,
        error: null
      }
    },
  })

export const deletePostSuccess = (state, { id }) =>
  state.merge({
    deletePostState: {
      ...state.get('deletePostState'),
      [id]: {
        loading: false,
        error: null
      }
    },
    posts: state.get('posts').filter(post => post._id !== id),
  })

export const deletePostFailure = (state, { id, error }) =>
  state.merge({
    deletePostState: {
      ...state.get('deletePostState'),
      [id]: {
        loading: false,
        error: error
      }
    },
  })

export const reducer = createReducer(INITIAL_STATE, {
  [PostsTypes.GET_POSTS_LOADING]: getPostsLoading,
  [PostsTypes.GET_POSTS_SUCCESS]: getPostsSuccess,
  [PostsTypes.GET_POSTS_FAILURE]: getPostsFailure,

  [PostsTypes.DELETE_POST_LOADING]: deletePostLoading,
  [PostsTypes.DELETE_POST_SUCCESS]: deletePostSuccess,
  [PostsTypes.DELETE_POST_FAILURE]: deletePostFailure,

  [PostsTypes.CREATE_POST_LOADING]: createPostLoading,
  [PostsTypes.CREATE_POST_SUCCESS]: createPostSuccess,
  [PostsTypes.CREATE_POST_FAILURE]: createPostFailure,

  [PostsTypes.GET_CURRENT_POST_DATA_LOADING]: getCurrentPostDataLoading,
  [PostsTypes.GET_CURRENT_POST_DATA_SUCCESS]: getCurrentPostDataSuccess,
  [PostsTypes.GET_CURRENT_POST_DATA_FAILURE]: getCurrentPostDataFailure,
})