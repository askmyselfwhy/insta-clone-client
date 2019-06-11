import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import UsersActions from '../../modules/users/actions';
import './style.css';

class UpdateForm extends React.Component {
  componentDidMount() {
    const { user } = this.props;
    this.props.form.setFields({
      first_name: {
        value: user.first_name,
      },
      last_name: {
        value: user.last_name,
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updateUser(values)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className="update-form">
        <div className='container'>
          <Form.Item label="First name">
            {getFieldDecorator('first_name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Last name">
            {getFieldDecorator('last_name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your last name!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </div>
      </Form>
    );
  }
}

const WrappedUpdateForm = Form.create({ name: 'update' })(UpdateForm);

const mapDispatchToProps = dispatch => ({
  updateUser: (data) => dispatch(UsersActions.update(data))
});

export default connect(null, mapDispatchToProps)(WrappedUpdateForm);
