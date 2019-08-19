/**
 * title: 设置试用期
 */
import React, { PureComponent } from 'react';
import { Flex, Switch, WingBlank, DatePicker, List, Icon, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import styles from './index.less';
import { formatDate } from '../../utils/utils';
// import { Link } from 'dva/router';
// import ListCard from '../../components/ListCard';
@connect(state => ({
    temporaryAccoumt: state.temporaryAccoumt,
}))
export default class TemporaryAccoumt extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/updateReducer',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/unmountReducer',
        });
    }
    handleInputTextSearch = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/updateReducer',
            payload: {
                phone: e.target.value,
            },
        });
    };
    handleChangeStartDate = date => {
        const { dispatch } = this.props;
        date = formatDate(date);
        dispatch({
            type: 'temporaryAccoumt/updateReducer',
            payload: {
                probationStartTime: date,
                isChangeStart: true,
            },
        });
    };
    handleChangeEndDate = date => {
        const { dispatch, temporaryAccoumt } = this.props;
        date = formatDate(date);
        dispatch({
            type: 'temporaryAccoumt/updateReducer',
            payload: {
                probationEndTime: date,
            },
        });
    };
    handleChangeSwitch = checked => {
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/updateReducer',
            payload: {
                isOnProbation: checked,
            },
        });
    };
    handleSearch = e => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/searchByPhone',
            payload: {
                userId: '',
            },
        });
    };
    handleSubmitInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'temporaryAccoumt/submitInfo',
        });
    };

    render() {
        const {
            temporaryAccoumt: {
                regTime,
                userId,
                mobilePhone,
                address,
                status,
                isOnProbation,
                probationStartTime,
                probationEndTime,
                defaultStartTime,
                defaultEndTime,
                butLoading,
            },
        } = this.props;
        return (
            <div>
                <div className={styles.searchBar}>
                    <form style={{ width: '100%' }} onSubmit={this.handleSearch} action="#">
                        <input
                            type="search"
                            className={styles.input}
                            placeholder="请输入客户手机号"
                            onChange={this.handleInputTextSearch}
                        />
                        <button className={styles.submitBtn} type="submit">
                            <Icon type="search" size="md" color="#666" />
                        </button>
                    </form>
                </div>
                {userId ? (
                    <WingBlank size="large">
                        <div className={styles.content}>
                            <p>
                                <span>注册时间：</span>
                                {regTime}
                            </p>
                            <p>
                                <span>登录账户：</span>
                                {mobilePhone}
                            </p>
                            <p>
                                <span>省份区域：</span>
                                {address}
                            </p>
                            <p>
                                <span>状态：</span>
                                {status}
                            </p>
                            <p style={{ display: 'inline-block', marginTop: 0, marginBottom: 0 }}>
                                <span>试用期：</span>
                            </p>
                            <Switch checked={isOnProbation} onChange={this.handleChangeSwitch} />
                        </div>
                        {isOnProbation ? (
                            <div className={styles.content}>
                                <p>
                                    <span>试用期限：</span>
                                </p>
                                <List>
                                    <DatePicker
                                        use12Hours
                                        value={
                                            probationStartTime
                                                ? new Date(probationStartTime)
                                                : new Date(defaultStartTime)
                                        }
                                        onChange={this.handleChangeStartDate}
                                    >
                                        <List.Item arrow="horizontal">开始时间</List.Item>
                                    </DatePicker>
                                    <DatePicker
                                        use12Hours
                                        value={
                                            probationEndTime
                                                ? new Date(probationEndTime)
                                                : new Date(defaultEndTime)
                                        }
                                        onChange={this.handleChangeEndDate}
                                    >
                                        <List.Item arrow="horizontal">结束时间</List.Item>
                                    </DatePicker>
                                </List>
                            </div>
                        ) : null}
                        <Flex style={{ width: '100%' }}>
                            <Flex.Item>
                                <Button
                                    type="primary"
                                    style={{ marginTop: 20 }}
                                    onClick={this.handleSubmitInfo}
                                    loading={butLoading}
                                >
                                    提交
                                </Button>
                            </Flex.Item>
                        </Flex>
                    </WingBlank>
                ) : (
                    <div style={{ width: '100%', marginTop: 100, textAlign: 'center' }}>
                        暂无数据
                    </div>
                )}
            </div>
        );
    }
}
