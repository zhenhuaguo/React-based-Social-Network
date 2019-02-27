import React from 'react';
import {Form, Input, Button, message} from 'antd';
import $ from 'jquery';
import {API_ROOT} from '../constants'
import {Link} from 'react-router-dom';


class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/signup`,
                    method: 'POST',
                    data: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                }).then(
                        (response) => {
                            message.success(response);
                            this.props.history.push('/login')
                        },
                        (response) => {
                            message.error(response.responseText);
                        }
                ).catch(
                        (error) => {
                            message.error(error);
                        },
                );
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
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
                <Form onSubmit={this.handleSubmit} className="register-form">
                    <Form.Item
                            {...formItemLayout}
                            label="Username"
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: 'Please input your username!', whitespace: true
                            }],
                        })(
                                <Input/>
                        )}
                    </Form.Item>
                    <Form.Item
                            {...formItemLayout}
                            label="Password"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: 'Please input your password!',
                            }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                                <Input type="password"/>
                        )}
                    </Form.Item>
                    <Form.Item
                            {...formItemLayout}
                            label="Confirm Password"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: 'Please confirm your password!',
                            }, {
                                validator: this.checkPassword,
                            }],
                        })(
                                <Input type="password" onBlur={this.handleConfirmBlur}/>
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">Register</Button>
                        <p>
                            You already have an account, go back to <Link to="/login"> login </Link>
                        </p>
                    </Form.Item>
                </Form>
        );
    }
}

export const Register = Form.create()(RegistrationForm);

