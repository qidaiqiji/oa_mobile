/**
 * title: 代发采购订单详情
 */
import React, { PureComponent } from 'react';
import { List, Button, Flex, WhiteSpace, Modal, WingBlank, NavBar, Icon, Toast } from 'antd-mobile';
import globalStyle from '@/assets/index.less';
import detailStyles from '@/assets/detailCommon.less';
import styles from './index.less';
import GoodsDetail from '@/components/GoodsDetail';
import PaymentDetail from '@/components/PaymentDetail';
import PayInfo from '@/components/PayInfo';
import FinanceInfo from '@/components/FinanceInfo';
import OperationLog from '@/components/OperationLog';
import SubOrderList from '@/components/SubOrderList';
import SubOrderDetail from '@/components/SubOrderDetail';
import { connect } from 'dva';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    salePurchaseOrderDetail: state.salePurchaseOrderDetail,
}))
export default class salePurchaseOrderDetail extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        dispatch({
            type: 'salePurchaseOrderDetail/getList',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'salePurchaseOrderDetail/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'salePurchaseOrderDetail/unmountReducer',
        });
    }

    // 显示弹窗
    handleShowItemModel = type => {
        const { dispatch } = this.props;

        dispatch({
            type: 'salePurchaseOrderDetail/updatePageReducer',
            payload: {
                [type]: true,
            },
        });
    };
    // 关闭弹窗
    handleCloseItemModel = type => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'salePurchaseOrderDetail/updatePageReducer',
            payload: {
                [type]: false,
            },
        });
    };

    handleReject = (value, actionUrl) => {
        const { dispatch, salePurchaseOrderDetail } = this.props;
        const { id } = salePurchaseOrderDetail;
        if (value === '') {
            Toast.info('请输入驳回备注', 1);
            return;
        } else {
            dispatch({
                type: 'salePurchaseOrderDetail/clickOkAction',
                payload: {
                    remark: value,
                    actionUrl,
                    id,
                },
            });
        }
    };
    handleConfirm = actionUrl => {
        const { dispatch, salePurchaseOrderDetail } = this.props;
        const { id, remark } = salePurchaseOrderDetail;
        dispatch({
            type: 'salePurchaseOrderDetail/clickOkAction',
            payload: {
                id,
                remark,
                actionUrl,
            },
        });
    };

    // 点击子单的查看全部商品
    handleShowSubOrderDeatil = id => {
        const { dispatch, salePurchaseOrderDetail } = this.props;
        const { subOrderList } = salePurchaseOrderDetail;
        let selectedSubOrderList = [];
        subOrderList.map(item => {
            if (+item.id === +id) {
                selectedSubOrderList.push(...item.goodsList);
            }
        });
        dispatch({
            type: 'salePurchaseOrderDetail/updatePageReducer',
            payload: {
                isShowSubOrder: false,
                isShowSubOrderDetail: true,
                selectedSubOrderList,
            },
        });
    };

    render() {
        const {
            salePurchaseOrderDetail: {
                status,
                supplier,
                purchaseSn,
                date,
                purchaser,
                goodsInfos,
                allPrice,
                balanceBillAmount,
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
                totalOrderGoodsList,
                isShowGoodsListModal,
                subOrderList,
                isShowSubOrder,
                selectedSubOrderList,
                isShowSubOrderDetail,
                payType,
                operaRecord,
                actionList,
                payTypeMap,
            },
        } = this.props;
        const allSubtotal = totalOrderGoodsList.reduce((pre, next) => {
            return pre + +next.subtotal;
        }, 0);
        let firstgoodsInfo = {};
        firstgoodsInfo = totalOrderGoodsList[0] != undefined && totalOrderGoodsList[0];

        return (
            <div>
                <List>
                    <Item multipleLine>
                        <Flex justify="between">
                            <span className={globalStyle.checkStatus}>审核状态</span>
                            <span className={globalStyle.status}>{status}</span>
                        </Flex>
                        <Brief>
                            <p className={globalStyle.line}>采购单号: {purchaseSn}</p>
                            <p>{date}</p>
                        </Brief>
                    </Item>
                    <Item multipleLine>
                        <div className={globalStyle.title}>
                            <p>
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
                <WhiteSpace size="xs" />
                <List>
                    <Item
                        arrow="horizontal"
                        onClick={this.handleShowItemModel.bind(this, 'isShowSubOrder')}
                    >
                        <span style={{ fontWeight: 'bold' }}>子单信息</span>
                    </Item>
                </List>
                <WhiteSpace size="xs" />
                <List>
                    <GoodsDetail
                        resdata={{
                            title: firstgoodsInfo.goodsName,
                            img: firstgoodsInfo.goodsImg,
                            line1_name: '销售价',
                            line1_price: firstgoodsInfo.salePrice,
                            line2_name: '毛利率',
                            line2_data: firstgoodsInfo.rossProfitRate,
                            line4_name: '零售价/平台价/折扣',
                            line4_price1: firstgoodsInfo.marketPrice,
                            line4_price2: firstgoodsInfo.shopPrice,
                            line4_price3: firstgoodsInfo.saleDiscount,
                            line5_name: '采购价/折扣',
                            line5_price1: firstgoodsInfo.purchasePrice,
                            line5_price2: firstgoodsInfo.purchaseDiscount,
                            isTax: firstgoodsInfo.purchaseIsTax ? '含税' : '不含税',
                            purchaseNumText: '采购数量',
                            purchaseNum: firstgoodsInfo.purchaseNum,
                        }}
                    />
                    <Item
                        multipleLine
                        arrow="horizontal"
                        onClick={this.handleShowItemModel.bind(this, 'isShowGoodsListModal')}
                    >
                        <Flex justify="center">
                            <p style={{ fontSize: '0.28rem' }}>
                                查看全部（商品共
                                <span style={{ color: 'red' }}>{totalOrderGoodsList.length}</span>
                                项）
                            </p>
                        </Flex>
                    </Item>
                    <PaymentDetail
                        config={{
                            allSubtotal: allSubtotal.toFixed(2),
                            balanceBillAmount,
                            isOutInv: isOutInv ? '是' : '否',
                            balanceBillOutInvAmount,
                            outInvAmount,
                            shouldPayAmount,
                        }}
                    />
                </List>
                <WhiteSpace size="xs" />
                {/* 支付信息 */}
                <PayInfo
                    config={{
                        payType: payTypeMap[payType],
                        expectShippingDate,
                        expectInvDate,
                        expectPayTime,
                    }}
                />
                <WhiteSpace size="xs" />

                {/* 财务信息 */}
                <List>
                    <Item
                        multipleLine
                        arrow="horizontal"
                        onClick={this.handleShowItemModel.bind(this, 'isShowFinanceNotes')}
                    >
                        <span className={globalStyle.checkStatus}>财务信息</span>
                    </Item>
                    <Item multipleLine>
                        <span className={globalStyle.checkStatus}>制单备注</span>
                    </Item>
                    <Item
                        multipleLine
                        arrow="horizontal"
                        onClick={this.handleShowItemModel.bind(this, 'isShowOpreationRecord')}
                    >
                        <span className={globalStyle.checkStatus}>操作日志</span>
                    </Item>
                </List>
                <WhiteSpace size="xs" />
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
                                                                      this.handleReject(
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
                                                  className={globalStyle.button}
                                                  onClick={() =>
                                                      alert('请确认是否审核通过', '', [
                                                          { text: '取消' },
                                                          {
                                                              text: '确认',
                                                              onPress: () =>
                                                                  this.handleConfirm(item.url),
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

                {/* 发票信息的弹窗 */}
                <FinanceInfo
                    config={{
                        isVisible: isShowFinanceNotes,
                        handleClose: this.handleCloseItemModel('isShowFinanceNotes'),
                        content: {
                            financeRemark,
                        },
                    }}
                />

                {/* 操作日志的弹窗 */}
                <OperationLog
                    config={{
                        isVisible: isShowOpreationRecord,
                        handleClose: this.handleCloseItemModel('isShowOpreationRecord'),
                        datasource: operaRecord,
                    }}
                />

                {/* 查看全部商品的弹窗 */}
                <Modal
                    className={detailStyles.modelTitleBlue}
                    visible={isShowGoodsListModal}
                    animationType="slide-up"
                    popup
                    onClose={this.handleCloseItemModel('isShowGoodsListModal')}
                    title="商品清单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.handleCloseItemModel('isShowGoodsListModal')();
                            },
                        },
                    ]}
                >
                    <div>
                        {totalOrderGoodsList.map(item => {
                            return (
                                <div key={item.id}>
                                    <GoodsDetail
                                        resdata={{
                                            title: item.goodsName,
                                            img: item.goodsImg,
                                            line1_name: '销售价',
                                            line1_price: item.salePrice,
                                            line2_name: '毛利率',
                                            line2_data: item.rossProfitRate,
                                            line4_name: '零售价/平台价/折扣',
                                            line4_price1: item.marketPrice,
                                            line4_price2: item.shopPrice,
                                            line4_price3: item.saleDiscount,
                                            line5_name: '采购价/折扣',
                                            line5_price1: item.purchasePrice,
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
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                {/* 子单信息列表的弹窗 */}
                <Modal
                    visible={isShowSubOrder}
                    className={detailStyles.modelTitleBlue}
                    popup
                    onClose={this.handleCloseItemModel('isShowSubOrder')}
                    animationType="slide-up"
                    title="子单信息"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.handleCloseItemModel('isShowSubOrder')();
                            },
                        },
                    ]}
                >
                    <div>
                        {subOrderList.map(item => {
                            return (
                                <div key={item.id}>
                                    <SubOrderList
                                        config={{
                                            title: {
                                                isShowTitle: false,
                                                status: item.status,
                                                subOrderSn: item.subOrderSn,
                                                consignee: item.receiver,
                                                mobile: item.mobile,
                                                address: item.address,
                                            },
                                            content: {
                                                img: item.goodsList[0].goodsThumb,
                                                title: item.goodsList[0].goodsName,
                                                line1_name: '订购数量',
                                                line1_num: item.goodsList[0].orderNum,
                                                line2_name: '本次出库',
                                                line2_num: item.goodsList[0].outNum,
                                                line2_right: '待出库',
                                                line2_rightNum: item.goodsList[0].awaitOutNum,
                                            },
                                        }}
                                    />
                                    <Item
                                        multipleLine
                                        arrow="horizontal"
                                        className={styles.listItem}
                                    >
                                        <Flex
                                            justify="center"
                                            onClick={this.handleShowSubOrderDeatil.bind(
                                                this,
                                                item.id
                                            )}
                                        >
                                            <span>
                                                查看全部（商品共
                                                <span style={{ color: 'red' }}>
                                                    {item.goodsList.length}
                                                </span>
                                                项）
                                            </span>
                                        </Flex>
                                    </Item>
                                    <WhiteSpace size="sm" />
                                </div>
                            );
                        })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                {/* 子单详情的弹窗 */}
                <Modal
                    visible={isShowSubOrderDetail}
                    className={detailStyles.modelTitleBlue}
                    popup
                    onClose={this.handleCloseItemModel('isShowSubOrderDetail')}
                    animationType="slide-up"
                    title="子单详情"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.handleCloseItemModel('isShowSubOrderDetail')();
                            },
                        },
                    ]}
                >
                    <div>
                        {selectedSubOrderList.map(item => {
                            return (
                                <SubOrderDetail
                                    key={item.id}
                                    config={{
                                        img: item.goodsThumb,
                                        title: item.goodsName,
                                        line1_name: '订购数量',
                                        line1_num: item.orderNum,
                                        line2_name: '本次出库',
                                        line2_num: item.outNum,
                                        line2_right: '待出库',
                                        line2_rightNum: item.awaitOutNum,
                                    }}
                                />
                            );
                        })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
            </div>
        );
    }
}
