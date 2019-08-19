/**
 * title: 工作台
 */
import React, { PureComponent } from 'react';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import { connect } from 'dva';
import Link from 'umi/link';
import logo from '../../assets/logo.png';
import styles from './index.less';
import BizIcon from '../../components/BizIcon';
@connect(state => ({
    dashboard: state.dashboard,
}))
export default class Dashboard extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'dashboard/getList',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'dashboard/unmountReducer',
        });
    }
    render() {
        const {
            dashboard: { orderList, role, roleMap },
        } = this.props;
        return (
            <div className={styles.dashboard}>
                <div className={styles.nav}>
                    <p className={styles.title}>审核工作台</p>
                    <p className={styles.titleText}>
                        用户名：
                        {role}
                    </p>
                    <span className={styles.setting}>
                        <BizIcon type={'shezhi'} />
                    </span>
                </div>
                <Flex wrap="wrap" style={{ padding: '40px 30px 0 30px' }}>
                    {orderList[0] &&
                        orderList[0].map((item, index) => {
                            return (
                                <Link
                                    to={`${item.url}/${item.status}`}
                                    className={styles.inline}
                                    key={index}
                                >
                                    <div>
                                        <p className={styles.num}>{item.orderNum}</p>
                                        <p className={styles.desc}>{item.orderTypeName}</p>
                                    </div>
                                </Link>
                            );
                        })}
                </Flex>
                <WingBlank>
                    <div style={{ marginTop: 30, fontWeight: 'bold' }}>业务工作台</div>
                </WingBlank>
                <Flex wrap="wrap" style={{ padding: '30px 30px 0 30px' }}>
                    <Link
                        to={'/temporaryAccount'}
                        className={styles.inline}
                        // key={index}
                    >
                        <div className={styles.center}>设置试用期</div>
                    </Link>
                </Flex>
            </div>
        );
    }
}
