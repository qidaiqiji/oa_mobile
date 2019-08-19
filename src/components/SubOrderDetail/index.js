import React, { PureComponent, Fragment } from 'react';
import { Flex, List, WhiteSpace, WingBlank } from 'antd-mobile';
import styles from './index.less';
const Item = List.Item;
class SubOrderDetail extends PureComponent {
    render() {
        const { config } = this.props;
        return (
            <Fragment>
                <List>
                    <WingBlank>
                        <Flex justify="start" className={styles.flex}>
                            <img src={config.img} alt="img" />
                            <div>
                                <p className={styles.title}>{config.title}</p>
                                {config.line1_num ? (
                                    <p style={{ marginTop: 10 }}>{`${config.line1_name}：${
                                        config.line1_num
                                    }`}</p>
                                ) : (
                                    ''
                                )}

                                <Flex justify="between">
                                    <span style={{ color: '#999' }}>{`${config.line2_name}：${
                                        config.line2_num
                                    }`}</span>
                                    <span style={{ color: '#999' }}>{`${config.line2_right}：${
                                        config.line2_rightNum
                                    }`}</span>
                                </Flex>
                            </div>
                        </Flex>
                    </WingBlank>
                </List>
                <WhiteSpace size="sm" />
            </Fragment>
        );
    }
}
export default SubOrderDetail;
