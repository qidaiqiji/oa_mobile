import React, { PureComponent, Fragment } from 'react';
import { Card, WhiteSpace, Modal, Button, WingBlank } from 'antd-mobile';
import styles from './index.less';
import detailStyles from '@/assets/detailCommon.less';
class FinanceInfo extends PureComponent {
    render() {
        const { config } = this.props;
        const { content } = config;
        return (
            <Fragment>
                <Modal
                    visible={config.isVisible}
                    className={detailStyles.modalButton}
                    popup
                    animationType="slide-up"
                    title={<p style={{ marginTop: 20 }}>发票信息</p>}
                    onClose={config.handleClose}
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                config.handleClose();
                            },
                        },
                    ]}
                >
                    <WhiteSpace />
                    <WingBlank>
                        <div className={styles.financeInfo}>{content.financeRemark}</div>
                    </WingBlank>
                    <WhiteSpace size="xl" />
                </Modal>
            </Fragment>
        );
    }
}
export default FinanceInfo;
