import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import UploadImageModal from '../UploadImageModal';
import './style.css';
import PostsActions from '../../modules/posts/actions';

function AddPhotoButton(props) {
  const { createPost } = props;
  const [isVisible, setVisible] = useState(false);
  const openModal  = () => setVisible(true);
  const closeModal = () => setVisible(false);
  const confirm = (data) => {
    const deferredPrompt = window.deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === 'dismissed') {
          console.log('User cancelled installation');
        } else {
          console.log('User added to home screen');
        }
      });
      window.deferredPrompt = null;
    }
    closeModal();
    createPost(data);
  }
  return (
    <React.Fragment>
      {isVisible && (
        <UploadImageModal
          visible={isVisible}
          onCancel={closeModal}
          onOk={confirm}
        />
      )
      }
      <Button
        onClick={openModal}
        size="large"
        type="primary"
        shape="circle"
        icon="plus"
        className="add-photo-button" />
    </React.Fragment>
  )
}

const mapDispatchToProps = dispatch => ({
  createPost: (data) => dispatch(PostsActions.createPost(data))
})

export default connect(null, mapDispatchToProps)(AddPhotoButton);