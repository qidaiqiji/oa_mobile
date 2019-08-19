/**
 * title: 货款单详情
 */
import React, { PureComponent } from 'react';
import { List, Button, Flex, WhiteSpace, Modal, Toast, NavBar, Icon } from 'antd-mobile';
import globalStyle from '@/assets/index.less';
import detailStyles from '@/assets/detailCommon.less';
import styles from './index.less';
import FinanceInfo from '@/components/FinanceInfo';
import GoodsDetail from '@/components/GoodsDetail';
import PaymentDetail from '@/components/PaymentDetail';
import PayInfo from '@/components/PayInfo';
import OperationLog from '@/components/OperationLog';
import SubOrderList from '@/components/SubOrderList';
import SubOrderDetail from '@/components/SubOrderDetail';
import { connect } from 'dva';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    applyForPaymentDetail: state.applyForPaymentDetail,
}))
export default class applyForPaymentDetail extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        dispatch({
            type: 'applyForPaymentDetail/getDetail',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'applyForPaymentDetail/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentDetail/unmountReducer',
        });
    }
    // 显示弹窗
    handleShowItemModel = type => {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentDetail/updatePageReducer',
            payload: {
                [type]: true,
            },
        });
    };
    // 关闭弹窗
    handleCloseItemModel = type => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentDetail/updatePageReducer',
            payload: {
                [type]: false,
            },
        });
    };

    handleOkConfirm = (value, actionUrl) => {
        const { dispatch, applyForPaymentDetail } = this.props;
        const { id } = applyForPaymentDetail;
        if (value === '') {
            Toast.info('请输入驳回备注', 1);
        } else {
            dispatch({
                type: 'applyForPaymentDetail/clickOkAction',
                payload: {
                    remark: value,
                    actionUrl,
                    id,
                },
            });
        }
    };
    // 点击isCommon为0时的子单的查看全部商品
    handleShowSubOrderDeatil = id => {
        const { dispatch, applyForPaymentDetail } = this.props;
        const { purchaseOrderList } = applyForPaymentDetail;
        let selectedSubOrderList = [];
        purchaseOrderList.map(item => {
            item.subOrderList.map(subOrder => {
                if (+subOrder.id === +id) {
                    selectedSubOrderList.push(...subOrder.goodsList);
                }
            });
        });
        dispatch({
            type: 'applyForPaymentDetail/updatePageReducer',
            payload: {
                isShowSubOrderList: false,
                isShowSubOrderDetail: true,
                selectedSubOrderList,
            },
        });
    };
    // 点击isCommon为1时的子单的查看全部商品
    handleShowCommonSubOrderDeatil = sn => {
        const { dispatch, applyForPaymentDetail } = this.props;
        const { purchaseOrderList } = applyForPaymentDetail;
        let selectedSubOrderList = [];
        purchaseOrderList.map(item => {
            if (item.sn == sn) {
                selectedSubOrderList.push(...item.goodsList);
            }
        });
        dispatch({
            type: 'applyForPaymentDetail/updatePageReducer',
            payload: {
                isShowSubOrderList: false,
                isShowSubOrderDetail: true,
                selectedSubOrderList,
            },
        });
    };

    render() {
        const {
            applyForPaymentDetail: {
                detail,
                isCredit,
                isSale,
                payInfo,
                isShowFinanceNotes,
                isShowOpreationRecord,
                isShowGoodsListModal,
                isShowSubOrderList,
                purchaseOrderList,
                isShowSubOrderDetail,
                selectedSubOrderList,
                id,
                operaRecord,
                payMethodMap,
                actionList,
            },
        } = this.props;
        let firstgoodsInfo = {};
        firstgoodsInfo = detail.goodsList != undefined && detail.goodsList[0];
        return (
            <div>
                <List>
                    <Item multipleLine>
                        <Flex justify="between">
                            <span className={globalStyle.checkStatus}>审核状态</span>
                            <span className={globalStyle.status}>{detail.status}</span>
                        </Flex>
                        <Brief>
                            <p>
                                货款申请单号: {id}
                                <span style={{ color: 'red' }}>{`（${
                                    isCredit ? '账期' : isSale ? '代发' : '库存'
                                }）`}</span>
                            </p>
                            <p>
                                关联采购单号：
                                {detail.purchaseOrderSn}
                            </p>
                            <p>{detail.time}</p>
                        </Brief>
                    </Item>
                    <Item multipleLine>
                        <div className={globalStyle.title}>
                            <p>
                                供应商：
                                {detail.supplier}
                            </p>
                            <p>
                                采购员：
                                {detail.purchaser}
                            </p>
                        </div>
                    </Item>
                </List>
                <WhiteSpace size="xs" />
                <List>
                    <Item
                        arrow="horizontal"
                        onClick={this.handleShowItemModel.bind(this, 'isShowSubOrderList')}
                    >
                        <span style={{ fontWeight: 'bold' }}>子单信息</span>
                    </Item>
                </List>
                <WhiteSpace size="xs" />
                <List>
                    {firstgoodsInfo ? (
                        <div>
                            <GoodsDetail
                                resdata={{
                                    title: firstgoodsInfo && firstgoodsInfo.goodsName,
                                    img: firstgoodsInfo && firstgoodsInfo.goodsThumb,
                                    isTax: firstgoodsInfo && firstgoodsInfo.purchaseIsTax,
                                    line1_name: isSale || isCredit ? '销售价' : '',
                                    line1_price:
                                        isSale || isCredit
                                            ? firstgoodsInfo && firstgoodsInfo.salePrice
                                            : '',
                                    line2_name: isSale || isCredit ? '毛利率' : '',
                                    line2_data:
                                        isSale || isCredit
                                            ? firstgoodsInfo && firstgoodsInfo.rate
                                            : '',
                                    payText: isCredit ? '预计付款时间' : '',
                                    expectPayTime: isCredit
                                        ? firstgoodsInfo && firstgoodsInfo.expectPayTime
                                        : '',
                                    subOrderText: isCredit ? '关联子单号' : '',
                                    subOrder: isCredit ? detail.subOrderSnStr : '',
                                    line4_name: '零售价/平台价/折扣',
                                    line4_price1: firstgoodsInfo && firstgoodsInfo.retailPrice,
                                    line4_price2:
                                        firstgoodsInfo && firstgoodsInfo.platformUnitPrice,
                                    line4_price3: firstgoodsInfo && firstgoodsInfo.saleDiscount,
                                    line5_name: '采购价/折扣',
                                    line5_price1: firstgoodsInfo && firstgoodsInfo.purchasePrice,
                                    line5_price2: firstgoodsInfo && firstgoodsInfo.purchaseDiscount,
                                    isTax:
                                        firstgoodsInfo && firstgoodsInfo.purchaseIsTax
                                            ? '含税'
                                            : '不含税',
                                    purchaseNumText: '采购数量',
                                    purchaseNum: firstgoodsInfo && firstgoodsInfo.purchaseNum,
                                }}
                            />
                            <Item
                                multipleLine
                                arrow="horizontal"
                                onClick={this.handleShowItemModel.bind(
                                    this,
                                    'isShowGoodsListModal'
                                )}
                            >
                                <Flex justify="center">
                                    <p style={{ fontSize: '0.28rem' }}>
                                        查看全部（商品共
                                        <span style={{ color: 'red' }}>
                                            {detail.goodsList != undefined &&
                                                detail.goodsList.length}
                                        </span>
                                        项）
                                    </p>
                                </Flex>
                            </Item>
                        </div>
                    ) : (
                        <Item>暂无商品</Item>
                    )}
                    {/* 采购金额信息 */}
                    <PaymentDetail
                        config={{
                            allSubtotal: payInfo.purchaseAmount,
                            balanceBillAmount: isCredit ? '' : payInfo.balanceBillAmount,
                            shouldPayAmount: payInfo.totalPurchaseAmount,
                            backDiscount: isCredit ? payInfo.backDiscountAmount : '',
                        }}
                    />
                </List>
                <WhiteSpace size="xs" />
                {/* 财务信息 */}
                <PayInfo
                    config={{
                        payType: payMethodMap[detail.payType],
                    }}
                />
                <WhiteSpace size="xs" />
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
                {/* 查看子单信息的弹窗 */}
                <Modal
                    visible={isShowSubOrderList}
                    className={detailStyles.modelTitleBlue}
                    onClose={this.handleCloseItemModel('isShowSubOrderList')}
                    popup
                    animationType="slide-up"
                    title="子单信息"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.handleCloseItemModel('isShowSubOrderList')();
                            },
                        },
                    ]}
                >
                    <div>
                        {purchaseOrderList.map(item => {
                            return (
                                <div key={item.id}>
                                    {item.isCommon ? (
                                        <div>
                                            <SubOrderList
                                                config={{
                                                    title: {
                                                        isShowTitle: true,
                                                        purchaseNo: item.sn,
                                                        time: item.time,
                                                        expectShippingDate: item.expectShippingDate,
                                                        subOrderSn:
                                                            item.goodsList[0] &&
                                                            item.goodsList[0].subOrderSn,
                                                        consignee: item.receiver,
                                                        mobile: item.mobile,
                                                        address: item.address,
                                                    },
                                                    content: {
                                                        img:
                                                            item.goodsList[0] &&
                                                            item.goodsList[0].goodsThumb,
                                                        title:
                                                            item.goodsList[0] &&
                                                            item.goodsList[0].goodsName,
                                                        line2_name: '订购数量',
                                                        line2_num:
                                                            item.goodsList[0] &&
                                                            item.goodsList[0].purchaseNum,
                                                        line2_right: '采购含税',
                                                        line2_rightNum:
                                                            item.goodsList[0] &&
                                                            item.goodsList[0].purchaseIsTax
                                                                ? '是'
                                                                : '否',
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
                                                    onClick={this.handleShowCommonSubOrderDeatil.bind(
                                                        this,
                                                        item.sn
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
                                    ) : (
                                        item.subOrderList.map(subOrder => {
                                            return (
                                                <div key={subOrder.id}>
                                                    <SubOrderList
                                                        config={{
                                                            title: {
                                                                isShowTitle: true,
                                                                purchaseNo: item.sn,
                                                                time: item.time,
                                                                expectShippingDate:
                                                                    item.expectShippingDate,
                                                                subOrderSn: subOrder.subOrderSn,
                                                                consignee: subOrder.receiver,
                                                                mobile: subOrder.mobile,
                                                                address: subOrder.address,
                                                            },
                                                            content: {
                                                                img:
                                                                    subOrder.goodsList[0]
                                                                        .goodsThumb,
                                                                title:
                                                                    subOrder.goodsList[0].goodsName,
                                                                line2_name: '订购数量',
                                                                line2_num:
                                                                    subOrder.goodsList[0].orderNum,
                                                                line2_right: '采购含税',
                                                                line2_rightNum: subOrder
                                                                    .goodsList[0].purchaseIsTax
                                                                    ? '是'
                                                                    : '否',
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
                                                                subOrder.id
                                                            )}
                                                        >
                                                            <span>
                                                                查看全部（商品共
                                                                <span style={{ color: 'red' }}>
                                                                    {subOrder.goodsList.length}
                                                                </span>
                                                                项）
                                                            </span>
                                                        </Flex>
                                                    </Item>
                                                    <WhiteSpace size="sm" />
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            );
                        })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                {/* 查看全部子单商品的弹窗 */}
                <Modal
                    visible={isShowSubOrderDetail}
                    className={detailStyles.modelTitleBlue}
                    onClose={this.handleCloseItemModel('isShowSubOrderDetail')}
                    popup
                    animationType="slide-up"
                    title="子单信息"
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
                                        line2_name: '订购数量',
                                        line2_num: item.purchaseNum
                                            ? item.purchaseNum
                                            : item.orderNum,
                                        line2_right: '采购含税',
                                        line2_rightNum: item.purchaseIsTax ? '是' : '否',
                                    }}
                                />
                            );
                        })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>

                {/* 查看全部商品的弹窗 */}
                <Modal
                    className={detailStyles.modelTitleBlue}
                    visible={isShowGoodsListModal}
                    onClose={this.handleCloseItemModel('isShowGoodsListModal')}
                    popup
                    animationType="slide-up"
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
                        {detail.goodsList &&
                            detail.goodsList.map(item => {
                                return (
                                    <div key={item.id}>
                                        <GoodsDetail
                                            resdata={{
                                                title: item.goodsName,
                                                img: item.goodsThumb,
                                                isTax: item.purchaseIsTax,
                                                line1_name: isSale || isCredit ? '销售价' : '',
                                                line1_price:
                                                    isSale || isCredit ? item.salePrice : '',
                                                line2_name: isSale || isCredit ? '毛利率' : '',
                                                line2_data: isSale || isCredit ? item.rate : '',
                                                payText: isCredit ? '预计付款时间' : '',
                                                expectPayTime: isCredit ? item.expectPayTime : '',
                                                subOrderText: isCredit ? '关联子单号' : '',
                                                subOrder: isCredit ? detail.subOrderSnStr : '',
                                                line4_name: '零售价/平台价/折扣',
                                                line4_price1: item.retailPrice,
                                                line4_price2: item.platformUnitPrice,
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
                {/* 财务信息的弹窗 */}
                <FinanceInfo
                    config={{
                        isVisible: isShowFinanceNotes,
                        handleClose: this.handleCloseItemModel('isShowFinanceNotes'),
                        content: {
                            financeRemark: detail.financeRemark,
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
            </div>
        );
    }
}
