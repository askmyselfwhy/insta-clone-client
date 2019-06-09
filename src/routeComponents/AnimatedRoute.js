import React from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup, } from 'react-transition-group'
import './style.css';

function AnimatedRoute({ Component, ...otherProps}) {
  return (
      <Route
        {...otherProps}
      />
  )
}

export default AnimatedRoute;