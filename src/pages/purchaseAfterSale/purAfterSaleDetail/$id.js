/**
 * title: 采购售后单详情
 */
import React, { PureComponent } from 'react';
import { List, Button, Modal, WhiteSpace, Flex, NavBar, Icon, Toast } from 'antd-mobile';
import { connect } from 'dva';
import GoodsDetail from '../../../components/GoodsDetail';
import globalStyle from '@/assets/index.less';
import styles from '@/assets/detailCommon.less';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    purAfterSaleDetail: state.purAfterSaleDetail,
}))
export default class purAfterSaleDetail extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purAfterSaleDetail/getList',
            payload: {
                purchaseBackOrderId: this.props.match.params.id,
            },
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purAfterSaleDetail/unmountReducer',
        });
    }
    showModal = type => e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purAfterSaleDetail/updateReducer',
            payload: {
                [type]: true,
            },
        });
    };
    onClose = type => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purAfterSaleDetail/updateReducer',
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
                type: 'purAfterSaleDetail/clickSureAction',
                payload: {
                    remark: value,
                    id,
                    actionurl,
                },
            });
        }
    }

    render() {
        const {
            purAfterSaleDetail: {
                totalOrder,
                goodsList,
                operateVisible,
                operationList,
                purListVisible,
                actionList,
            },
        } = this.props;
        const allReturnMoney = goodsList.reduce((pre, next) => {
            return pre + +next.returnMoney;
        }, 0);
        return (
            <div>
                <div key={totalOrder.id}>
                    <List className="my-list">
                        <Item extra={<span style={{ color: 'red' }}>{totalOrder.status}</span>}>
                            审核状态
                        </Item>
                        <Item>
                            <Brief>
                                退单号：
                                <span>{totalOrder.sn}</span>
                            </Brief>
                        </Item>
                        <Item>
                            <Brief>
                                {' '}
                                关联采购单号：
                                <span>
                                    {totalOrder.relatedPurchaseOrderSn &&
                                        totalOrder.relatedPurchaseOrderSn}
                                </span>
                            </Brief>
                        </Item>
                    </List>
                    <List className="my-list">
                        <Item
                            extra={
                                <span style={{ color: 'red' }}>
                                    {totalOrder.relatedPurchaseOrderStatus}
                                </span>
                            }
                        >
                            关联订单状态
                        </Item>
                        <Item
                            extra={<span style={{ color: 'red' }}>{totalOrder.isReturnGoods}</span>}
                        >
                            售后类型
                        </Item>
                        <Item>
                            <Brief>
                                <span>{totalOrder.supplierName}</span>
                            </Brief>
                        </Item>
                        <Item>
                            <Brief>
                                <span>采购员：</span>
                                <span>{totalOrder.purchaserName}</span>
                            </Brief>
                        </Item>
                    </List>
                    <WhiteSpace />
                </div>
                <div>
                    <GoodsDetail
                        key={goodsList[0] && goodsList[0].id}
                        resdata={{
                            title: goodsList[0] && goodsList[0].name,
                            img: goodsList[0] && goodsList[0].img,
                            line1_name: '单价',
                            line1_price: goodsList[0] && goodsList[0].price,
                            isTaxLine1: goodsList[0] && goodsList[0].isTax ? '含税' : '不含税',
                            line7_name: '售后数',
                            line7_data: goodsList[0] && goodsList[0].returnNum,
                            line7_rightName: '售后金额',
                            line7_rightD: goodsList[0] && goodsList[0].returnMoney,
                            isTax: goodsList[0] && goodsList[0].isTax,
                        }}
                    />
                    <List className="my-list">
                        <Item
                            onClick={this.showModal('purListVisible')}
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
                            <p>退款总额:</p>
                            <span>￥{allReturnMoney.toFixed(2)}</span>
                        </div>
                        <div>
                            <p>退款特批价:</p>
                            <span>￥{totalOrder.specialPrice}</span>
                        </div>
                        <div>
                            <p>应退总额:</p>
                            <span>
                                ￥
                                {totalOrder.isSpecial
                                    ? totalOrder.specialPrice
                                    : allReturnMoney.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <List className="my-list">
                        <Item extra={totalOrder.receiptMethod}>退款方式</Item>
                    </List>
                    <List className="my-list">
                        <div className={styles.remark}>
                            <div>退款信息</div>
                            <div>{totalOrder.relatedPurchaseOrderStatus}</div>
                        </div>
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
                                    if (action.text.indexOf('驳回') != -1) {
                                        return (
                                            <Button
                                                type="primary"
                                                className={globalStyle.button}
                                                inline
                                                style={{ marginRight: 10 }}
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
                                                {action.text}
                                            </Button>
                                        );
                                    }
                                })}
                                {actionList.map(action => {
                                    if (action.text.indexOf('审核') != -1) {
                                        return (
                                            <Button
                                                type="primary"
                                                inline
                                                style={{ marginRight: 10 }}
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
                                                {action.text}
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
                    <div style={{ maxHeight: 600, minHeight: 100, overflow: 'scroll' }}>
                        <WhiteSpace />
                        {operationList &&
                            operationList.map(item => {
                                return (
                                    <div>
                                        <div>
                                            <Flex.Item
                                                style={{ textAlign: 'left', paddingLeft: '0.1rem' }}
                                            >
                                                {item.content}
                                            </Flex.Item>
                                            <Flex justify="between">
                                                <Flex.Item style={{ paddingLeft: '0.1rem' }}>
                                                    {item.user}
                                                </Flex.Item>
                                                <Flex.Item>{item.time}</Flex.Item>
                                            </Flex>
                                        </div>
                                        <WhiteSpace />
                                    </div>
                                );
                            })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                <Modal
                    visible={purListVisible}
                    className={styles.modelTitleBlue}
                    popup
                    animationType="slide-up"
                    onClose={this.onClose('purListVisible')}
                    title="商品清单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('purListVisible')();
                            },
                        },
                    ]}
                >
                    <div>
                        <WhiteSpace size="md" />
                        {goodsList.map(item => {
                            return (
                                <div>
                                    <GoodsDetail
                                        key={item.id}
                                        resdata={{
                                            title: item.name,
                                            img: item.img,
                                            line1_name: '单价',
                                            line1_price: item.price,
                                            line7_name: '售后数',
                                            line7_data: item.returnNum,
                                            line7_rightName: '售后金额',
                                            line7_rightD: item.returnMoney,
                                            isTax: item.isTax,
                                        }}
                                    />
                                    <WhiteSpace size="xs" />
                                </div>
                            );
                        })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
            </div>
        );
    }
}
