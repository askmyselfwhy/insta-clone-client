import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Icon, Button } from 'antd';
import PostsActions from '../../modules/posts/actions';
import './style.css';
import { deletePostLoading } from '../../modules/posts/selectors';
const { Meta } = Card;

function Post(props) {
  const { post, currentUserId, isPostDeleting, deletePost } = props;
  const { _id, meta: { comments, likes }, title, image_url, description, user_id } = post;
  const onClick = () => props.history.push(`/posts/${_id}`);
  const onDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    deletePost(_id)
  }
  return (
    <Card onClick={onClick}
      hoverable
      extra={user_id === currentUserId &&
        <Button
          loading={isPostDeleting}
          icon={'close'}
          onClick={onDeleteClick}
          shape="circle"/>
      }
      cover={
        <div style={{ textAlign: 'center' }}>
          <img
            alt="example"
            src={image_url}
            style={{ maxHeight: 'max-content', width: '100%', maxWidth: 'max-content' }}
          />
        </div>
      }
      actions={[
        <span style={{ color: 'red' }}>{likes} <Icon type="heart" theme="twoTone" twoToneColor="red"/></span>,
        <span style={{ color: 'orange' }}>{comments} <Icon type="message" theme="twoTone" twoToneColor="orange"/></span>
      ]}>
        <Meta
          title={<div style={{ textAlign: 'center' }}>{title}</div>}
          description={description}/>
    </Card>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { post } = ownProps;
  const { _id: postId } = post; 
  return {
    isPostDeleting: deletePostLoading(state, postId)
  }
}

const mapDispatchToProps = dispatch => ({
  deletePost: (id) => dispatch(PostsActions.deletePost(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Post));
