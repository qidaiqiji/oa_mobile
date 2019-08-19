/**
 * title: 销售订单详情
 */
import React, { PureComponent } from 'react';
import { List, Card, Button, Modal, WhiteSpace, Flex, WingBlank, Toast } from 'antd-mobile';
import { connect } from 'dva';
import GoodsDetail from '../../../components/GoodsDetail';
import styles from '@/assets/detailCommon.less';
import globalStyle from '@/assets/index.less';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    orderDetail: state.orderDetail,
}))
export default class orderDetail extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        Toast.loading('加载中...', 0);
        dispatch({
            type: 'orderDetail/getList',
            payload: {
                id: this.props.match.params.id,
            },
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'orderDetail/unmountReducer',
        });
    }
    showModal = type => e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'orderDetail/updateReducer',
            payload: {
                [type]: true,
            },
        });
    };
    onClose = type => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'orderDetail/updateReducer',
            payload: {
                [type]: false,
            },
        });
    };
    clickSureAction(value, actionurl) {
        const { dispatch } = this.props;
        const { id } = this.props.match.params;
        if (value === '') {
            Toast.info('请输入驳回备注', 1);
            return;
        } else {
            dispatch({
                type: 'orderDetail/clickSureAction',
                payload: {
                    id,
                    actionurl,
                    totalOrderId: id,
                    remark: value,
                },
            });
        }
    }

    render() {
        const {
            orderDetail: {
                totalOrder,
                goodsList,
                subOrders,
                listSonVisible,
                invioceVisible,
                operateVisible,
                operaRecord,
                goodsListVisible,
                checkStatusMap,
                statusMap,
                actionList,
            },
        } = this.props;
        let priceColor = '';
        if (goodsList[0] && +goodsList[0].onlinePrice > +goodsList[0].price) {
            priceColor = '#f00';
        } else if (goodsList[0] && +goodsList[0].onlinePrice < +goodsList[0].price) {
            priceColor = '#080';
        } else {
            priceColor = '#000';
        }
        return (
            <div>
                <div key={totalOrder.id}>
                    <List className="my-list">
                        <Item extra={<span style={{ color: 'red' }} />}>审核状态</Item>
                        <Item>
                            <Brief>
                                总订单号：
                                <span>{totalOrder.totalOrderNo}</span>
                            </Brief>
                        </Item>
                        <Item
                            arrow="horizontal"
                            multipleLine
                            onClick={this.showModal('listSonVisible')}
                        >
                            <Brief>
                                关联子单：
                                {subOrders.map(subOrder => {
                                    return (
                                        <span style={{ marginRight: 6 }}>
                                            {subOrder.subOrderNo}
                                        </span>
                                    );
                                })}
                            </Brief>
                        </Item>
                        <Item>
                            <Brief>{totalOrder.deliveryTime}</Brief>
                        </Item>
                        <Item
                            extra={
                                <span style={{ color: 'red' }}>
                                    {statusMap[totalOrder.totalOrderStatus]}
                                </span>
                            }
                        >
                            订单状态
                        </Item>
                        <Item>
                            <Brief>
                                <span>客户名：</span>
                                <span>{totalOrder.customer}</span>
                            </Brief>
                        </Item>
                        <Item>
                            <Brief>
                                <span>业务员：</span>
                                <span>{totalOrder.salesman}</span>
                            </Brief>
                        </Item>
                    </List>
                    <WhiteSpace />
                </div>
                {/* )
                })} */}
                <div>
                    <GoodsDetail
                        key={goodsList[0] && goodsList[0].id}
                        resdata={{
                            title: goodsList[0] && goodsList[0].name,
                            img: goodsList[0] && goodsList[0].img,
                            line1_name: '线上价',
                            line1_price: goodsList[0] && goodsList[0].onlinePrice,
                            line1_discount: goodsList[0] && goodsList[0].discount,
                            line2_name: '利润',
                            line2_data: goodsList[0] && goodsList[0].profit,
                            line6_name: '销售价',
                            line6_price1: goodsList[0] && goodsList[0].price,
                            line6_price2: goodsList[0] && goodsList[0].onlinePrice,
                            priceColor: priceColor,
                            line6_num: goodsList[0] && goodsList[0].number,
                            isTax: goodsList[0] && goodsList[0].isTax,
                        }}
                    />
                    <List className="my-list">
                        <Item
                            onClick={this.showModal('goodsListVisible')}
                            className={styles.textCenter}
                            style={{ textAlign: 'center' }}
                            arrow="horizontal"
                        >
                            查看全部（商品共
                            <span style={{ color: '#CC0000' }}>{goodsList.length}</span>
                            项）
                        </Item>
                    </List>
                    <div className={styles.priceTotalM}>
                        <div>
                            <p>订单总额:</p>
                            <span>￥{totalOrder.actualAmount}</span>
                        </div>
                        <div>
                            <p>订单特批价:</p>
                            <span>￥{totalOrder.specialAmount}</span>
                        </div>
                        <div>
                            <p>应付总额:</p>
                            <span>￥{totalOrder.allAmount}</span>
                        </div>
                    </div>
                    <List className="my-list">
                        <Item extra={totalOrder.express}>运费信息</Item>
                        <Item wrap>
                            <p style={{ marginBottom: '0.2rem', fontWeight: 'bold' }}>收货信息</p>
                            {totalOrder.consignee
                                ? [
                                      <p>
                                          {totalOrder.consignee.name}
                                          <span style={{ display: 'inline-block', marginLeft: 20 }}>
                                              {totalOrder.consignee.mobile}
                                          </span>
                                      </p>,
                                      <p>{totalOrder.consignee.address}</p>,
                                  ]
                                : null}
                        </Item>
                        <Item extra={totalOrder.deliveryTime}>到期回款时间</Item>
                        <Item extra={totalOrder.payInfo ? totalOrder.payInfo.payMethod : ''}>
                            支付方式
                        </Item>
                        <Item
                            extra={totalOrder.invoiceInfo ? totalOrder.invoiceInfo.invoiceType : ''}
                            arrow="horizontal"
                            onClick={this.showModal('invioceVisible')}
                        >
                            发票信息
                        </Item>
                        <div className={styles.remark}>
                            <div>制单备注</div>
                            <div>{totalOrder.remark}</div>
                        </div>
                        <Item arrow="horizontal" onClick={this.showModal('operateVisible')}>
                            操作日志
                        </Item>
                    </List>
                    {/* <div className={styles.buttonSelf} style={{ textAlign: 'center' }}> */}
                    <List>
                        <Item>
                            <Flex justify="around">
                                {actionList.map(action => {
                                    if (action.name.indexOf('驳回') != -1) {
                                        return (
                                            <Button
                                                type="primary"
                                                inline
                                                className={globalStyle.button}
                                                onClick={() =>
                                                    prompt(
                                                        '请确认是否驳回',
                                                        '',
                                                        [
                                                            { text: '取消' },
                                                            {
                                                                text: '确定',
                                                                onPress: value =>
                                                                    this.clickSureAction(
                                                                        value,
                                                                        action.url
                                                                    ),
                                                            },
                                                        ],
                                                        'default',
                                                        null,
                                                        ['请输入内容']
                                                    )
                                                }
                                            >
                                                {action.name}
                                            </Button>
                                        );
                                    }
                                })}
                                {actionList.map(action => {
                                    if (action.name.indexOf('审核') != -1) {
                                        return (
                                            <Button
                                                type="primary"
                                                inline
                                                className={globalStyle.button}
                                                onClick={() =>
                                                    alert('请确认是否审核通过', '', [
                                                        { text: '取消' },
                                                        {
                                                            text: '确定',
                                                            onPress: value =>
                                                                this.clickSureAction(
                                                                    null,
                                                                    action.url
                                                                ),
                                                        },
                                                    ])
                                                }
                                            >
                                                {action.name}
                                            </Button>
                                        );
                                    }
                                })}
                            </Flex>
                        </Item>
                    </List>

                    {/* </div> */}
                </div>
                <Modal
                    visible={listSonVisible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('listSonVisible')}
                    title="关联子单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('listSonVisible')();
                            },
                        },
                    ]}
                >
                    <div style={{ maxHeight: 600, minHeight: 100, overflow: 'scroll' }}>
                        {subOrders.map(subOrder => {
                            return (
                                <p key={subOrder.subOrderId}>
                                    子单号：
                                    <span>{subOrder.subOrderNo}</span>
                                </p>
                            );
                        })}
                    </div>
                </Modal>
                <Modal
                    visible={invioceVisible}
                    className={styles.modalButton}
                    popup
                    animationType="slide-up"
                    maskClosable={false}
                    onClose={this.onClose('invioceVisible')}
                    title="发票信息"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('invioceVisible')();
                            },
                        },
                    ]}
                >
                    <div
                        style={{
                            maxHeight: 600,
                            minHeight: 100,
                            overflow: 'scroll',
                            textAlign: 'left',
                            padding: '0.3rem',
                        }}
                    >
                        {totalOrder.invoiceInfo &&
                        totalOrder.invoiceInfo.invoiceType !== '不开票' ? (
                            [
                                <p>
                                    发票类型：
                                    <span>{totalOrder.invoiceInfo.invoiceType || ''}</span>
                                </p>,
                                <p>
                                    发票抬头：
                                    <span>{totalOrder.invoiceInfo.companyName || ''}</span>
                                </p>,
                                <p>
                                    企业税号：
                                    <span>{totalOrder.invoiceInfo.companyTaxID || ''}</span>
                                </p>,
                                <p>
                                    开户银行：
                                    <span>{totalOrder.invoiceInfo.bank || ''}</span>
                                </p>,
                                <p>
                                    单位地址：
                                    <span>{totalOrder.invoiceInfo.address || ''}</span>
                                </p>,
                                <p>
                                    联系电话：
                                    <span>{totalOrder.invoiceInfo.phoneNumber || ''}</span>
                                </p>,
                            ]
                        ) : (
                            <p>
                                发票类型：
                                <span>不开票</span>
                            </p>
                        )}
                    </div>
                </Modal>
                <Modal
                    visible={operateVisible}
                    className={styles.modelTitleBlue}
                    popup
                    animationType="slide-up"
                    onClose={this.onClose('operateVisible')}
                    title="操作日志"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('operateVisible')();
                            },
                        },
                    ]}
                >
                    <div>
                        {operaRecord &&
                            operaRecord.map(item => {
                                return (
                                    <div
                                        style={{
                                            maxHeight: 600,
                                            minHeight: 100,
                                            overflow: 'scroll',
                                        }}
                                    >
                                        <List>
                                            <WingBlank>
                                                <Item wrap>
                                                    <p style={{ marginBottom: 10 }}>
                                                        {item.actionNote}
                                                    </p>
                                                    <Flex justify="between">
                                                        <span style={{ color: '#999' }}>
                                                            {item.action}
                                                        </span>
                                                        <span style={{ color: '#999' }}>
                                                            {item.operaTime}
                                                        </span>
                                                    </Flex>
                                                </Item>
                                            </WingBlank>
                                        </List>
                                        <WhiteSpace size="sm" />
                                    </div>
                                );
                            })}
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                <Modal
                    visible={goodsListVisible}
                    className={styles.modelTitleBlue}
                    popup
                    animationType="slide-up"
                    onClose={this.onClose('goodsListVisible')}
                    title="商品清单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('goodsListVisible')();
                            },
                        },
                    ]}
                >
                    <div>
                        {goodsList.map(item => {
                            let priceColor = '';
                            if (item.onlinePrice > +item.price) {
                                priceColor = '#f00';
                            } else if (item.onlinePrice < +item.price) {
                                priceColor = '#080';
                            } else {
                                priceColor = '#000';
                            }
                            return (
                                <div key={item.id}>
                                    <GoodsDetail
                                        resdata={{
                                            title: item.name,
                                            img: item.img,
                                            line1_name: '线上价',
                                            line1_price: item.onlinePrice,
                                            line1_discount: item.discount,
                                            line2_name: '利润',
                                            line2_data: item.profit,
                                            line6_name: '销售价',
                                            line6_price1: item.price,
                                            line6_price2: item.onlinePrice,
                                            priceColor,
                                            line6_num: item.number,
                                            isTax: item.isTax,
                                        }}
                                    />
                                    <WhiteSpace size="xs" />
                                </div>
                            );
                        })}
                        <WhiteSpace size="xl" />
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
            </div>
        );
    }
}
