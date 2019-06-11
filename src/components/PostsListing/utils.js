import React from 'react'
import { Skeleton, Card, Icon } from 'antd';

export function generateSkeletonPosts(numberOfPosts, isLoading) {
  return Array(numberOfPosts).fill().map((_, index) => (
    <Card
      key={'skeleteton-post-' + index}
      style={{ width: '100%' }}
      actions={[
        <Icon type="heart" />,
        <Icon type="message" />
      ]}>
      <Skeleton loading={isLoading} avatar={{ size: 'large' }} active/>
    </Card>
  ))
}