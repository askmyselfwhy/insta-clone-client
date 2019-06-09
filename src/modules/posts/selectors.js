import { path } from 'ramda';

export const getPosts        = state => state.posts.get('posts')
export const getPostsLoading = state => state.posts.get('getPostsLoading')
export const getPostsError   = state => state.posts.get('getPostsError')

export const getCurrentPost  = state => state.posts.get('currentPost')
export const getCurrentPostDataLoading = state => state.posts.get('getCurrentPostDataLoading')

export const createPostLoading = state => state.posts.get('createPostLoading')

export const deletePostLoading = (state, id) => Boolean(path([id, 'loading'], state.posts.get('deletePostState')))
export const deletePostError   = (state, id) => path([id, 'error'], state.posts.get('deletePostState'))