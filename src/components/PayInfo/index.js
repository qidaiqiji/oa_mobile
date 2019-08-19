import React, { PureComponent, Fragment } from 'react';
import { List } from 'antd-mobile';
import styles from './index.less';
const Item = List.Item;
class PayInfo extends PureComponent {
    render() {
        const { config } = this.props;
        return (
            <Fragment>
                <List>
                    <Item
                        multipleLine
                        extra={<span className={styles.extraTitle}>{config.payType}</span>}
                    >
                        <span className={styles.checkStatus}>支付类型</span>
                    </Item>
                    {config.expectShippingDate ? (
                        <Item
                            multipleLine
                            extra={
                                <span className={styles.extraTitle}>
                                    {config.expectShippingDate}
                                </span>
                            }
                        >
                            <span className={styles.checkStatus}>预计发货时间</span>
                        </Item>
                    ) : null}
                    {config.expectInvDate ? (
                        <Item
                            multipleLine
                            extra={
                                <span className={styles.extraTitle}>{config.expectInvDate}</span>
                            }
                        >
                            <span className={styles.checkStatus}>预计开票时间</span>
                        </Item>
                    ) : null}
                    {config.expectPayTime ? (
                        <Item
                            multipleLine
                            extra={
                                <span className={styles.extraTitle}>{config.expectPayTime}</span>
                            }
                        >
                            <span className={styles.checkStatus}>预计付款时间</span>
                        </Item>
                    ) : null}
                </List>
            </Fragment>
        );
    }
}
export default PayInfo;
