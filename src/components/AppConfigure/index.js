import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Layout, Menu, Icon, Typography } from 'antd';
import UsersActions from '../../modules/users/actions';
import AppActions from '../../modules/app/actions';
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

  setCollapsed = (collapsed) => {
    this.setState({ collapsed })
  }

  render() {
    const { collapsed } = this.state;
    const { currentUser, isLogged } = this.props;
  
    const onCollapse = collapsed => {
      this.setCollapsed(collapsed);
    };
  
    return (
      isLogged
       ? <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className='logo' />
            <Typography style={{ color: '#fff', textAlign: 'center' }}>
              {currentUser.first_name + ' ' + currentUser.last_name}
            </Typography>
            <Menu
              theme='dark'
              defaultSelectedKeys={[this.props.location.pathname]}
              mode='inline'>
              <Menu.Item
                onClick={() => this.props.history.push('/')}
                key='/'>
                <Icon type='dashboard' />
                <span>Dashboard</span>
              </Menu.Item>
              <Menu.Item key='/settings'
                onClick={() => this.props.history.push('/settings')}>
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
          <MainContent/>
        </Layout>
      : <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/register' component={Register}/>
          <Route path='*' component={Login}/>
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
  setDefferedPrompt: (event) => dispatch(AppActions.setDefferedPrompt(event))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppConfigure));