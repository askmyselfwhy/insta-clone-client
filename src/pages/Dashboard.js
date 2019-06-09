import React from 'react'
import AddPhotoButton from '../components/AddPhotoButton';
import PostsListing from '../components/PostsListing';

function Dashboard(props) {
  return (
    <div style={{ height: '100%' }}>
      <PostsListing/>
      <AddPhotoButton/>
    </div>
  )
}

export default Dashboard;