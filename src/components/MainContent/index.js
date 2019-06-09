import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { CSSTransition, TransitionGroup, } from 'react-transition-group';
import Dashboard from '../../pages/Dashboard';
import Post from '../../pages/Post';
import Settings from '../../pages/Settings';
import './style.css';

const { Content, Footer } = Layout;

function MainContent(props) {
  const { location } = props
  return (
    <Layout>
      <Content style={{ padding: 16 }}>
        <TransitionGroup className={'routes'}>
          <CSSTransition timeout={300} classNames="fade" key={location.key}>
            <section className="route-section">
              <Switch location={location}>
                <Route exact path='/' component={Dashboard}/>
                <Route path='/settings' component={Settings}/>
                <Route path='/posts/:post_id' component={Post}/>
                <Route component={Dashboard} />
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2019 Created by Some user</Footer>
    </Layout>
  )
}

export default withRouter(MainContent);