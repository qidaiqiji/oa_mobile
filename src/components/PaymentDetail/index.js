import React, { PureComponent, Fragment } from 'react';
import { Flex, List } from 'antd-mobile';
import styles from './index.less';
const Item = List.Item;
class PaymentDetail extends PureComponent {
    render() {
        const { config } = this.props;
        return (
            <div className={styles.listLIne}>
                <Item>
                    {config.allSubtotal ? (
                        <Flex justify="between">
                            <span>采购金额</span>
                            <span>{`￥${config.allSubtotal}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.balanceBillAmount || config.balanceBillAmount === 0 ? (
                        <Flex justify="between">
                            <span>挂账抵扣</span>
                            <span>{`￥${config.balanceBillAmount}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.backDiscount ? (
                        <Flex justify="between">
                            <span>售后折扣</span>
                            <span>{`￥${config.backDiscount}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.isOutInv ? (
                        <Flex justify="between">
                            <span>抵扣金额是否开票</span>
                            <span>{config.isOutInv}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.balanceBillOutInvAmount || +config.balanceBillOutInvAmount === 0 ? (
                        <Flex justify="between">
                            <span>抵扣金额需开票金额</span>
                            <span>{`￥${config.balanceBillOutInvAmount}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.outInvAmount || +config.outInvAmount === 0 ? (
                        <Flex justify="between">
                            <span>开票总金额</span>
                            <span>{`￥${config.outInvAmount}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {config.shouldPayAmount || +config.shouldPayAmount === 0 ? (
                        <Flex justify="between">
                            <span>采购应付总额</span>
                            <span style={{ color: 'red' }}>{`￥${config.shouldPayAmount}`}</span>
                        </Flex>
                    ) : (
                        ''
                    )}
                </Item>
            </div>
        );
    }
}
export default PaymentDetail;
