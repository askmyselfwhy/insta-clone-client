import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button } from 'antd';
import UsersActions from '../../modules/users/actions';
import './style.css';

function LoginForm(props) {
  const { login, form } = props;
  const { getFieldDecorator, validateFields, } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) login(values.username, values.password);
    });
  };
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <div className='form-container'>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/register">register now!</a>
        </Form.Item>
      </div>
    </Form>
  );
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(UsersActions.login(username, password))
})

export default connect(null, mapDispatchToProps)(WrappedLoginForm)