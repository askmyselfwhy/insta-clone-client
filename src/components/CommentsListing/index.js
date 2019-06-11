import React from 'react'
import moment from 'moment';
import { Comment, Tooltip, List, Skeleton } from 'antd';

function CommentsListing(props) {
  const { isLoading = true, comments } = props;
  const data = comments.map(comment => {
    return {
      actions: [<span>Reply to</span>],
      author: comment.first_name + ' ' + comment.last_name,
      avatar: comment.avatar || 'https://education.fsu.edu/wp-content/uploads/2016/09/staff-avatar-man.png',
      content: <p>{ comment.message }</p>,
      datetime: (
        <Tooltip
          title={ moment(comment.created_at).format('YYYY-MM-DD HH:mm:ss') }>
          <span>
            { moment(comment.created_at).fromNow() }
          </span>
        </Tooltip>
      ),
    }
  })
  return (
    isLoading
    ? <div>
        {
          Array(data.length || 3).fill().map((_, index) =>
              <Skeleton key={index} loading avatar={{ size: 'large' }} active/>
            )
        }
      </div>
    : data.length === 0
      ? 'No comments'
      : <List
          className="comment-list"
          header={`${data.length} replies`}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <li>
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime}
              />
            </li>
          )}
        />
  )
}

export default CommentsListing;