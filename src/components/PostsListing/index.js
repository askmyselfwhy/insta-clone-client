import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import sizeMe from 'react-sizeme';
import StackGrid from "react-stack-grid";
import Post from '../Post';
import PostsActions from '../../modules/posts/actions';
import { getCurrentUser } from '../../modules/users/selectors';
import { getPosts, getPostsLoading } from '../../modules/posts/selectors';
import { generateSkeletonPosts } from './utils';

class PostsListing extends React.Component {
  componentDidMount() {
    this.props.getPosts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.getPostsIsLoading && !this.props.getPostsIsLoading) {
      // Items in StackGrid sometimes overlapping when data were fetched from external
      // This hack just update the grid layout after data were fetched
      setTimeout(() => this.grid.updateLayout(), 1000)
    }
  }

  render() {
    const {
      getPostsIsLoading: isLoading,
      posts,
      currentUser,
      size: {
        width
      }
    } = this.props;
    const { _id: currentUserId } = currentUser;

    return (
      <StackGrid
        gridRef={grid => this.grid = grid}
        gutterWidth={20}
        gutterHeight={20}
        duration={0}
        columnWidth={
          width <= 690
            ? '100%'
            : width <= 960
              ? '50%'
              : '33.33%'
        }>
        {isLoading
          ? generateSkeletonPosts(posts && (posts.length || 6), true)
          : posts.map((post) => {
            const id = post.id;
            return (
              <div key={id}>
                <Post key={`post-${id}`} currentUserId={currentUserId} post={post} />
              </div>
            )
          })}
      </StackGrid>
    )
  }
}

const mapStateToProps = state => ({
  posts: getPosts(state),
  getPostsIsLoading: getPostsLoading(state),
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(PostsActions.getPosts()),
})

export default sizeMe()(withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsListing)));