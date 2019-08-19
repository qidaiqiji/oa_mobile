/**
 * title: 销售售后单详情
 */
import React, { PureComponent } from 'react';
import { List, Button, Modal, WhiteSpace, Flex, NavBar, Icon, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import GoodsDetail from '../../../components/GoodsDetail';
import globalStyle from '@/assets/index.less';
import { bold } from 'ansi-colors';
import styles from '@/assets/detailCommon.less';
const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;
const alert = Modal.alert;
@connect(state => ({
    afterSaleDetail: state.afterSaleDetail,
}))
export default class afterSaleDetail extends PureComponent {
    componentDidMount() {
        Toast.loading('加载中...', 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleDetail/getList',
            payload: {
                backOrderId: this.props.match.params.id,
            },
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleDetail/unmountReducer',
        });
    }
    showModal = type => e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleDetail/updateReducer',
            payload: {
                [type]: true,
            },
        });
    };
    onClose = type => () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleDetail/updateReducer',
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
                type: 'afterSaleDetail/clickSureAction',
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
            afterSaleDetail: {
                totalOrder,
                goodsList,
                operateVisible,
                operationList,
                afterSaleListVisible,
                actionList,
            },
        } = this.props;
        const allbackSubtotal = goodsList.reduce((pre, next) => {
            return pre + +next.backSubtotal;
        }, 0);
        return (
            <div>
                <div>
                    <List className="my-list">
                        <Item
                            extra={<span style={{ color: 'red' }}>{totalOrder.checkStatus}</span>}
                        >
                            审核状态
                        </Item>
                        <Item>
                            <Brief>
                                退单号：
                                <span>{totalOrder.backOrderSn}</span>
                            </Brief>
                        </Item>
                        <Item>
                            <Brief>
                                {' '}
                                关联总单：
                                <span>{totalOrder.orderSn && totalOrder.orderSn.sn}</span>
                            </Brief>
                        </Item>
                        <Item
                            extra={<span style={{ color: 'red' }}>{totalOrder.orderStatus}</span>}
                        >
                            关联订单状态
                        </Item>
                        <Item extra={<span style={{ color: 'red' }}>{totalOrder.type}</span>}>
                            售后类型
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
                                <span>{totalOrder.saler}</span>
                            </Brief>
                        </Item>
                    </List>
                    <WhiteSpace />
                </div>
                <div>
                    <GoodsDetail
                        key={goodsList[0] && goodsList[0].id}
                        resdata={{
                            title: goodsList[0] && goodsList[0].goodsName,
                            img: goodsList[0] && goodsList[0].goodsThumb,
                            line1_name: '单价',
                            line1_price: goodsList[0] && goodsList[0].price,
                            isTaxLine1: goodsList[0] && goodsList[0].isTax ? '含税' : '不含税',
                            line7_name: '售后数',
                            line7_data: goodsList[0] && goodsList[0].backNumber,
                            line7_rightName: '售后金额',
                            line7_rightD: goodsList[0] && goodsList[0].backSubtotal,
                            isTax: goodsList[0] && goodsList[0].isTax,
                        }}
                    />
                    <List className="my-list">
                        <Item
                            onClick={this.showModal('afterSaleListVisible')}
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
                            <span>￥{allbackSubtotal}</span>
                        </div>
                        <div>
                            <p>退款特批价:</p>
                            <span>￥{totalOrder.specialPrice}</span>
                        </div>
                        <div>
                            <p>应退总额:</p>
                            <span>￥{totalOrder.isSpecial ? specialPrice : allbackSubtotal}</span>
                        </div>
                    </div>
                    <List className="my-list">
                        <Item extra={totalOrder.refundType}>退款方式</Item>
                    </List>
                    <List className="my-list">
                        <div className={styles.remark}>
                            <div>退款信息</div>
                            <div>{totalOrder.refundInfoContent}</div>
                        </div>
                        <div className={styles.remark}>
                            <div>制单备注</div>
                            <div>{totalOrder.remark}</div>
                        </div>
                        <Item arrow="horizontal" onClick={this.showModal('operateVisible')}>
                            操作日志
                        </Item>
                    </List>
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
                        <WhiteSpace size="sm" />
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
                                        <WhiteSpace size="sm" />
                                    </div>
                                );
                            })}
                        <WhiteSpace size="xl" />
                    </div>
                </Modal>
                <Modal
                    visible={afterSaleListVisible}
                    className={styles.modelTitleBlue}
                    popup
                    animationType="slide-up"
                    onClose={this.onClose('afterSaleListVisible')}
                    title="商品清单"
                    footer={[
                        {
                            text: '确认',
                            onPress: () => {
                                this.onClose('afterSaleListVisible')();
                            },
                        },
                    ]}
                >
                    <div>
                        {goodsList.map(item => {
                            return (
                                <div>
                                    <GoodsDetail
                                        key={item.id}
                                        resdata={{
                                            title: item.goodsName,
                                            img: item.goodsThumb,
                                            line1_name: '单价',
                                            line1_price: item.price,
                                            line7_name: '售后数',
                                            line7_data: item.backNumber,
                                            line7_rightName: '售后金额',
                                            line7_rightD: item.backSubtotal,
                                            isTax: item.isTax,
                                        }}
                                    />
                                    <WhiteSpace size="sm" />
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
