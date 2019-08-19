/**
 * title: 库存采购单详情
 */
import React, { PureComponent } from 'react';
import { List, Button, Flex, WhiteSpace, Modal, NavBar, Icon, Toast } from 'antd-mobile';
import globalStyle from '@/assets/index.less';
import styles from './index.less';
import detailStyles from '@/assets/detailCommon.less';
import { connect } from 'dva';
import GoodsDetail from '@/components/GoodsDetail';
import FinanceInfo from '@/components/FinanceInfo';
import OperationLog from '@/components/OperationLog';
import PayInfo from '@/components/PayInfo';
import PaymentDetail from '@/components/PaymentDetail';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    commonPurchaseDetail: state.commonPurchaseDetail,
}))
export default class commonPurchaseDetail extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        dispatch({
            type: 'commonPurchaseDetail/getList',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'commonPurchaseDetail/reqGetConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
    }
    // 点击显示采购信息的弹窗
    handleShowFinanceNotes = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                isShowFinanceNotes: true,
            },
        });
    };
    handleCloseFinanceModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                isShowFinanceNotes: false,
            },
        });
    };
    // 点击查看全部商品
    handleShowGoodsList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                isShowGoodsListModal: true,
            },
        });
    };
    // 关闭全部商品列表的弹窗
    handleCloseGoodsListModal = key => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                [key]: false,
            },
        });
    };

    handleOkConfirm = (value, actionUrl) => {
        const { dispatch, commonPurchaseDetail } = this.props;
        const { id } = commonPurchaseDetail;
        if (value === '') {
            Toast.info('请输入驳回备注', 1);
            return;
        } else {
            dispatch({
                type: 'commonPurchaseDetail/clickOkAction',
                payload: {
                    remark: value,
                    id,
                    actionUrl,
                },
            });
        }
    };
    handleShowOperationRecord = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                isShowOpreationRecord: true,
            },
        });
    };
    // 关闭操作日志的弹窗
    handleCloseOperationModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseDetail/updatePageReducer',
            payload: {
                isShowOpreationRecord: false,
            },
        });
    };
    render() {
        const {
            commonPurchaseDetail: {
                status,
                supplier,
                orderNo,
                date,
                purchaser,
                goodsInfos,
                allPrice,
                balanceBillLastAmount,
                isOutInv,
                balanceBillOutInvAmount,
                outInvAmount,
                shouldPayAmount,
                expectShippingDate,
                expectInvDate,
                expectPayTime,
                isShowFinanceNotes,
                financeRemark,
                isShowOpreationRecord,
                actionList,
                isShowGoodsListModal,
                gifts,
                operaRecord,
                payTypeMap,
                payType,
                remark,
            },
        } = this.props;
        let firstgoodsInfo = {};
        firstgoodsInfo = goodsInfos[0] != undefined && goodsInfos[0];
        return (
            <div>
                <List>
                    <Item multipleLine>
                        <Flex justify="between">
                            <span className={globalStyle.checkStatus}>审核状态</span>
                            <span className={globalStyle.status}>{status}</span>
                        </Flex>
                        <Brief>
                            <p className={globalStyle.line}>采购单号: {orderNo}</p>
                            <p className={globalStyle.line}>{date}</p>
                        </Brief>
                    </Item>
                    <Item multipleLine>
                        <div className={globalStyle.title}>
                            <p className={globalStyle.line}>
                                供应商：
                                {supplier}
                            </p>
                            <p>
                                采购员：
                                {purchaser}
                            </p>
                        </div>
                    </Item>
                </List>
                <WhiteSpace size="sm" />
                <List>
                    <GoodsDetail
                        resdata={{
                            title: firstgoodsInfo.goodsName,
                            img: firstgoodsInfo.img,
                            line4_name: '零售价/平台价/折扣',
                            line4_price1: firstgoodsInfo.marketPrice,
                            line4_price2: firstgoodsInfo.shopPrice,
                            line4_price3: firstgoodsInfo.saleDiscount,
                            line5_name: '采购价/折扣',
                            line5_price1: firstgoodsInfo.purchaseIsTax
                                ? firstgoodsInfo.purchaseTaxPrice
                                : firstgoodsInfo.supplyPrice,
                            line5_price2: firstgoodsInfo.purchaseDiscount,
                            isTax: firstgoodsInfo.purchaseIsTax ? '含税' : '不含税',
                            purchaseNumText: '采购数量',
                            purchaseNum: firstgoodsInfo.purchaseNum,
                        }}
                    />
                    {/* 记得做判断是否显示查看全部 */}
                    <Item multipleLine arrow="horizontal" onClick={this.handleShowGoodsList}>
                        <Flex justify="center">
                            <p style={{ fontSize: '0.28rem' }}>
                                查看全部（商品共
                                <span style={{ color: 'red' }}>{goodsInfos.length}</span>
                                项）
                            </p>
                        </Flex>
                    </Item>
                    <PaymentDetail
                        config={{
                            allSubtotal: allPrice,
                            balanceBillAmount: balanceBillLastAmount,
                            isOutInv: isOutInv ? '是' : '否',
                            balanceBillOutInvAmount,
                            outInvAmount,
                            shouldPayAmount,
                        }}
                    />
                </List>
                <WhiteSpace size="sm" />
                {/* 支付信息 */}
                <PayInfo
                    config={{
                        payType: payTypeMap[payType],
                        expectShippingDate,
                        expectInvDate,
                        expectPayTime,
                    }}
                />
                <WhiteSpace size="sm" />
                {/* 财务信息 */}
                <List>
                    <Item multipleLine arrow="horizontal" onClick={this.handleShowFinanceNotes}>
                        <span className={globalStyle.checkStatus}>财务信息</span>
                    </Item>
                    <Item multipleLine wrap align="top">
                        <p className={globalStyle.remarkTitle}>制单备注</p>
                        <p className={globalStyle.remark}>{remark}</p>
                    </Item>
                    <Item multipleLine arrow="horizontal" onClick={this.handleShowOperationRecord}>
                        <span className={globalStyle.checkStatus}>操作日志</span>
                    </Item>
                </List>
                <WhiteSpace />
                <List>
                    <Item>
                        <Flex justify="around">
                            {actionList
                                ? actionList.map((item, index) => {
                                      if (item.name.indexOf('驳回') !== -1) {
                                          return (
                                              <Button
                                                  key={index}
                                                  inline
                                                  type="primary"
                                                  style={{ marginRight: 10 }}
                                                  className={globalStyle.button}
                                                  onClick={() =>
                                                      prompt(
                                                          '请确认是否驳回',
                                                          '',
                                                          [
                                                              { text: '取消' },
                                                              {
                                                                  text: '确认',
                                                                  onPress: value =>
                                                                      this.handleOkConfirm(
                                                                          value,
                                                                          item.url
                                                                      ),
                                                              },
                                                          ],
                                                          'default',
                                                          null,
                                                          ['请填写驳回备注']
                                                      )
                                                  }
                                              >
                                                  {item.name}
                                              </Button>
                                          );
                                      }
                                      if (item.name.indexOf('审核') !== -1) {
                                          return (
                                              <Button
                                                  inline
                                                  key={index}
                                                  type="primary"
                                                  style={{ marginRight: 10 }}
                                                  className={globalStyle.button}
                                                  onClick={() =>
                                                      alert('请确认是否审核通过', '', [
                                                          { text: '取消' },
                                                          {
                                                              text: '确认',
                                                              onPress: () =>
                                                                  this.handleOkConfirm(
                                                                      null,
                                                                      item.url
                                                                  ),
                                                          },
                                                      ])
                                                  }
                                              >
                                                  {item.name}
                                              </Button>
                                          );
                                      }
                                  })
                                : ''}
                        </Flex>
                    </Item>
                </List>
                {/* 财务信息的弹窗 */}
                <FinanceInfo
                    config={{
                        isVisible: isShowFinanceNotes,
                        handleClose: this.handleCloseFinanceModal,
                        content: {
                            financeRemark,
                        },
                    }}
                />
                {/* 操作日志的弹窗 */}
                <OperationLog
                    config={{
                        isVisible: isShowOpreationRecord,
                        handleClose: this.handleCloseOperationModal,
                        datasource: operaRecord,
                    }}
                />

                {/* 查看全部商品的modal */}
                <Modal
                    className={detailStyles.modelTitleBlue}
                    visible={isShowGoodsListModal}
                    animationType="slide-up"
                    popup
                    onClose={this.handleCloseGoodsListModal('isShowGoodsListModal')}
                    title="商品清单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.handleCloseGoodsListModal('isShowGoodsListModal')();
                            },
                        },
                    ]}
                >
                    <div style={{ position: 'relative' }}>
                        {goodsInfos.map(item => {
                            return (
                                <div key={item.id}>
                                    <GoodsDetail
                                        resdata={{
                                            title: item.goodsName,
                                            img: item.img,
                                            line4_name: '零售价/平台价/折扣',
                                            line4_price1: item.marketPrice,
                                            line4_price2: item.shopPrice,
                                            line4_price3: item.saleDiscount,
                                            line5_name: '采购价/折扣',
                                            line5_price1: item.purchaseIsTax
                                                ? item.purchaseTaxPrice
                                                : item.supplyPrice,
                                            line5_price2: item.purchaseDiscount,
                                            isTax: item.purchaseIsTax ? '含税' : '不含税',
                                            purchaseNumText: '采购数量',
                                            purchaseNum: item.purchaseNum,
                                        }}
                                    />
                                    <WhiteSpace size="sm" />
                                </div>
                            );
                        })}
                        {gifts.length > 0 ? (
                            <div>
                                <WhiteSpace />
                                <p className={styles.gift}>赠品列表</p>
                                {gifts.map(item => {
                                    return (
                                        <div key={item.id}>
                                            <WhiteSpace size="sm" />
                                            <GoodsDetail
                                                resdata={{
                                                    title: item.goodsName,
                                                    img: item.img,
                                                    line4_name: '零售价/平台价/折扣',
                                                    line4_price1: item.marketPrice,
                                                    line4_price2: item.shopPrice,
                                                    line4_price3: item.saleDiscount,
                                                    line5_name: '采购价/折扣',
                                                    line5_price1: item.purchaseIsTax
                                                        ? item.purchaseTaxPrice
                                                        : item.supplyPrice,
                                                    line5_price2: item.purchaseDiscount,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
            </div>
        );
    }
}
