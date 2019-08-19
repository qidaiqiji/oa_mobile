import React, { PureComponent, Fragment } from 'react';
import { WhiteSpace, Modal, List, WingBlank, Button, Icon, Flex } from 'antd-mobile';
import commonStyle from '@/assets/detailCommon.less';
class OperationLog extends PureComponent {
    render() {
        const { config } = this.props;
        return (
            <Fragment>
                <Modal
                    visible={config.isVisible}
                    popup
                    className={commonStyle.modelTitleBlue}
                    animationType="slide-up"
                    wrapClassName={commonStyle.wrap}
                    onClose={config.handleClose}
                    title="操作日志"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                config.handleClose();
                            },
                        },
                    ]}
                >
                    <div>
                        {config.datasource
                            ? config.datasource.map(item => {
                                  return (
                                      <div
                                          key={item.purchaseOrderId}
                                          className={commonStyle.listStyle}
                                      >
                                          <List>
                                              <WingBlank>
                                                  <List.Item multipleLine wrap>
                                                      <p style={{ marginBottom: 10 }}>
                                                          {item.note}
                                                      </p>
                                                      <Flex justify="between">
                                                          <span style={{ color: '#999' }}>
                                                              {item.action}
                                                          </span>
                                                          <span style={{ color: '#999' }}>
                                                              {item.operaTime}
                                                          </span>
                                                      </Flex>
                                                  </List.Item>
                                              </WingBlank>
                                          </List>
                                          <WhiteSpace size="xs" />
                                      </div>
                                  );
                              })
                            : ''}
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
            </Fragment>
        );
    }
}
export default OperationLog;
