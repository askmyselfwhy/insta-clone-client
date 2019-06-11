import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, Typography } from 'antd';
import PostsActions from '../modules/posts/actions';
import { getCurrentUser } from '../modules/users/selectors';
import { getCurrentPost, getCurrentPostDataLoading } from '../modules/posts/selectors';
import CommentsListing from '../components/CommentsListing';

const { Paragraph } = Typography;

function Post(props) {
  const { getCurrentPostData, getCurrentPostDataIsLoading, currentPost, currentUser, match } = props;
  const { _id: currentUserId } = currentUser;
  const { post, comments } = currentPost;
  const { meta, created_at, title, description: desc, image_url, user_id: ownerUserId } = post;
  const [description, setDescription] = useState(desc);
  const onChange = str => {
    // This called when enter key pressed
    setDescription(str);
  };
  useEffect(() => {
    getCurrentPostData(match.params.post_id);
  }, [match.params.post_id])
  useEffect(() => {
    setDescription(desc);
  }, [desc])
  return (
    <div style={{ background: '#fff', height: '100%', padding: 16 }}>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <span>Created on { moment(created_at).format('YYYY-MM-DD HH:mm:ss') }</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2em' }}>{ title }</h1>
        {getCurrentPostDataIsLoading
          ? <img
            alt="example"
            src={"https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-300x225.png"}
            style={{ width: '100%', maxWidth: 300, maxHeight: 'max-content' }}
          />
          : <img
            alt="example"
            src={image_url}
            style={{ width: '100%', maxWidth: 'max-content', maxHeight: 'max-content' }}
          />
        }
        <Paragraph
          style={{ marginTop: 16 }}
          editable={currentUserId === ownerUserId ? { onChange } : null}>
          { description }
        </Paragraph>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ color: 'red' }}>{ getCurrentPostDataIsLoading ? '' : meta ? meta.likes : '' } <Icon type="heart" theme="twoTone" twoToneColor="red" /></span>
      </div>
      <CommentsListing isLoading={getCurrentPostDataIsLoading} comments={comments} />
    </div>
  )
}

const mapStateToProps = state => ({
  currentPost: getCurrentPost(state),
  getCurrentPostDataIsLoading: getCurrentPostDataLoading(state),
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = (dispatch) => ({
  getCurrentPostData: (postId) => dispatch(PostsActions.getCurrentPostData(postId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Post);