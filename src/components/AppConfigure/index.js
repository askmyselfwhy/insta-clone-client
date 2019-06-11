import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Layout, Menu, Icon, Typography } from 'antd';
import UsersActions from '../../modules/users/actions';
import { getCurrentUser, isLogged } from '../../modules/users/selectors';
import MainContent from '../MainContent';
import Login from '../../pages/Login/';
import Register from '../../pages/Register/';

const { Sider } = Layout;

class AppConfigure extends React.Component {
  state = {
    collapsed: true,
  };

  componentDidMount() {
    this.props.checkIsLogged();
  }

  onCollapse = collapsed =>    this.setCollapsed(collapsed);
  onRedirect   = (path) => () => this.props.history.push(path)

  render() {
    const { onRedirect } = this;
    const { collapsed } = this.state;
    const { currentUser, isLogged } = this.props;
    return (
      isLogged
        ? <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
              <div className='logo' />
              <Typography style={{ color: '#fff', textAlign: 'center' }}>
                {currentUser.first_name + ' ' + currentUser.last_name}
              </Typography>
              <Menu
                theme='dark'
                defaultSelectedKeys={[this.props.location.pathname]}
                mode='inline'>
                <Menu.Item
                  onClick={onRedirect('/')}
                  key='/'>
                  <Icon type='dashboard' />
                  <span>Dashboard</span>
                </Menu.Item>
                <Menu.Item key='/settings'
                  onClick={onRedirect('/settings')}>
                  <Icon type='setting' />
                  <span>Settings</span>
                </Menu.Item>
                <Menu.Item
                  onClick={this.props.logout}>
                  <Icon type="logout" />
                  <span>Logout</span>
                </Menu.Item>
              </Menu>
            </Sider>
            <MainContent />
          </Layout>
        : <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='*' component={Login} />
          </Switch>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  isLogged: isLogged(state)
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(UsersActions.logout()),
  checkIsLogged: () => dispatch(UsersActions.checkIsLogged()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppConfigure));