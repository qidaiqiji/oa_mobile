import React, { PureComponent, Fragment } from 'react';
import { Flex, List, WhiteSpace, WingBlank } from 'antd-mobile';
import styles from './index.less';
const Item = List.Item;
class SubOrderList extends PureComponent {
    render() {
        const { config } = this.props;
        const { title, content } = config;
        return (
            <Fragment>
                {title.isShowTitle ? (
                    <div className={styles.title}>
                        <WingBlank>
                            <Flex justify="between">
                                <span>
                                    采购单号：
                                    {title.purchaseNo}
                                </span>
                                <span>{title.time}</span>
                            </Flex>
                            <p>
                                预计发货时间：
                                {title.expectShippingDate}
                            </p>
                        </WingBlank>
                    </div>
                ) : null}
                <List>
                    <Item multipleLine wrap>
                        <div className={styles.line}>
                            {title.status ? (
                                <Flex justify="between">
                                    <span style={{ fontWeight: 'bold' }}>状态</span>
                                    <span style={{ color: 'red' }}>{title.status}</span>
                                </Flex>
                            ) : null}

                            <p>
                                子单号:
                                {title.subOrderSn}
                            </p>
                            <Flex justify="between">
                                <span>
                                    收货人：
                                    {title.consignee}
                                </span>
                                <span>
                                    手机号：
                                    {title.mobile}
                                </span>
                            </Flex>
                            <p>
                                收货地址:
                                {title.address}
                            </p>
                        </div>
                    </Item>
                    <WingBlank>
                        {/* <Item className={styles.img}> */}
                        <Flex justify="start" className={styles.flex}>
                            {content.img ? <img src={content.img} alt="img" /> : ''}
                            <div>
                                <p>{content.title}</p>
                                {content.line1_num ? (
                                    <p>{`${content.line1_name}：${content.line1_num}`}</p>
                                ) : (
                                    ''
                                )}
                                <Flex justify="between">
                                    <span>{`${content.line2_name}：${content.line2_num}`}</span>
                                    {content.line2_right ? (
                                        <span>{`${content.line2_right}：${
                                            content.line2_rightNum
                                        }`}</span>
                                    ) : (
                                        ''
                                    )}
                                </Flex>
                            </div>
                        </Flex>

                        {/* </Item> */}
                    </WingBlank>
                </List>
            </Fragment>
        );
    }
}
export default SubOrderList;
