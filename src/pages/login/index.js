/**
 * title: 登录
 */
import React, { PureComponent } from 'react';
import { Icon, Button, Toast, List, InputItem, WingBlank } from 'antd-mobile';
import { connect } from 'dva';
import logo from '../../assets/logo.png';
import styles from './index.less';
import Router from 'umi/router';
import { createForm, formShape } from 'rc-form';
import BizIcon from '../../components/BizIcon';
@connect(state => ({
    globalModel: state.globalModel,
}))
class BasicInputForm extends PureComponent {
    static propTypes = {
        form: formShape,
    };
    componentWillMount() {
        this.nameDecorator = this.props.form.getFieldDecorator('username', {
            initialValue: '',
            rules: [
                {
                    required: true,
                },
            ],
        });
        this.passDecorator = this.props.form.getFieldDecorator('password', {
            initialValue: '',
            rules: [
                {
                    required: true,
                },
            ],
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.globalModel.isLogin) {
            Router.push('/dashboard');
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        this.props.form.validateFields((error, values) => {
            if (error && error.username) {
                Toast.fail('请输入用户名');
                return;
            } else if (error && error.password) {
                Toast.fail('请输入密码');
                return;
            }
            dispatch({
                type: 'globalModel/author',
                payload: values,
            });
        });
    };
    render() {
        const {
            globalModel: { isButtonLoading },
        } = this.props;
        return (
            <div className={styles.index}>
                <h1 className={styles.title}>小美诚品OA系统</h1>
                <div className={styles.content}>
                    <p className={styles.login}>
                        <BizIcon type={'yonghu2'} style={{ fontSize: 30 }} />
                        {this.nameDecorator(
                            <input
                                placeholder="请输入手机号"
                                className={styles.textInput}
                                className={styles.textInput}
                            />
                        )}
                    </p>
                    <p className={styles.login}>
                        <BizIcon type={'key'} style={{ fontSize: 30 }} />
                        {this.passDecorator(
                            <input
                                type="password"
                                placeholder="请输入密码"
                                className={styles.textInput}
                            />
                        )}
                    </p>
                    <p className={styles.submit}>
                        <Button
                            onClick={this.handleSubmit}
                            style={{ color: '#108ee9' }}
                            loading={isButtonLoading}
                        >
                            登录
                        </Button>
                    </p>
                </div>
                <div className={styles.logo}>
                    <img src={logo} alt="logo" />
                </div>
            </div>
        );
    }
}
const Login = createForm()(BasicInputForm);
export default Login;
