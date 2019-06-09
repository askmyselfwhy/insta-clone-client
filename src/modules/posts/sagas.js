import { put, takeLatest, fork, call, all, select } from 'redux-saga/effects';
import { notification } from 'antd';
import PostsActions, { PostsTypes } from './actions';
import { getToken, getCurrentUser } from '../users/selectors';
import axios from '../../utils/axios';
import { writeData } from '../../utils/indexedDB';
import { apiUrl } from '../../config';
// Sagas
function * getPosts () {
  yield put(PostsActions.getPostsLoading());
  try {
    const { data: posts } = yield call(axios.get, '/posts');
    yield put(PostsActions.getPostsSuccess(posts));
  } catch (error) {
    yield put(PostsActions.getPostsFailure(error));
  }
}

function * getCurrentPostData ({ postId }) {
  yield put(PostsActions.getCurrentPostDataLoading());
  try {
    const [{ data: post }, { data: comments }] = yield all([
      yield call(axios.get, `/posts/${postId}`),
      yield call(axios.get, `/posts/${postId}/comments`)
    ])
    yield put(PostsActions.getCurrentPostDataSuccess(postId, post, comments));
  } catch (error) {
    yield put(PostsActions.getCurrentPostDataFailure(error));
  }
}

function * createPost ({ data }) {
  yield put(PostsActions.createPostLoading());
  try {
    const {
      title,
      description,
      image_data,
      locationCoordinates,
      location
    } = data
    const [currentUser, token] = yield select(state => [
      getCurrentUser(state),
      getToken(state)
    ])
    const post = {
      id: new Date().toISOString(),
      user_id: currentUser._id,
      title,
      description,
      image_data,
      locationCoordinates,
      location,
    }
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.getRegistration()
        .then(function (sw) {
          writeData('sync-posts', {
            ...post,
            headers: {
              'Authorization': token
            }
          })
          sw.sync.register('sync-new-posts')
        });
    } else {
      var postData = new FormData();
      postData.append('user_id', post.user_id);
      postData.append('title', post.title);
      postData.append('location', post.location);
      postData.append('description', post.description);
      postData.append('locationCoordinates', post.locationCoordinates);
      postData.append('image_data', post.image_data, post.id + '.png');

      // If we have no SyncManager we just send the request to the backend
      yield call(fetch, `${apiUrl}/posts`, {
        method: 'POST',
        body: postData
      })
    }
    // In both casses we retrieve all posts again to refresh the list of posts
    notification.success({ message: 'Your post was successfully added!'})
    yield put(PostsActions.createPostSuccess());
    yield put(PostsActions.getPosts())
  } catch (error) {
    yield put(PostsActions.createPostFailure(error));
  }
}

function * deletePost ({ id }) {
  yield put(PostsActions.deletePostLoading(id));
  try {
    yield call(axios.delete, `/posts/${id}`);
    yield put(PostsActions.deletePostSuccess(id));
  } catch (error) {
    yield put(PostsActions.deletePostFailure(id, error));
  }
}

// Watchers
function * getPostsWatcher() {
  yield takeLatest(PostsTypes.GET_POSTS, getPosts);
}

function * getCurrentPostDataWatcher() {
  yield takeLatest(PostsTypes.GET_CURRENT_POST_DATA, getCurrentPostData);
}

function * createPostWatcher() {
  yield takeLatest(PostsTypes.CREATE_POST, createPost);
}

function * deletePostWatcher() {
  yield takeLatest(PostsTypes.DELETE_POST, deletePost);
}

export default function * root () {
  yield fork(getPostsWatcher);
  yield fork(getCurrentPostDataWatcher);
  yield fork(createPostWatcher);
  yield fork(deletePostWatcher);
}