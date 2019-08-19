/**
 * title: 销售订单列表
 */
import React, { PureComponent } from 'react';
import { Flex, WhiteSpace, SearchBar, Card, ListView } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ListCard from '../../components/ListCard';
// import styles from './index.less';
import { bold } from 'ansi-colors';
@connect(state => ({
    saleOrderList: state.saleOrderList,
}))
export default class SaleOrderList extends PureComponent {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: ds,
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleOrderList/getList',
            payload: {
                status: this.props.match.params.index,
            },
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleOrderList/unmountReducer',
        });
    }
    handleChangeSearchText = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleOrderList/updateReducer',
            payload: {
                customer: e,
            },
        });
    };
    // 清空 totalList
    handleInputTextSearch(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleOrderList/getList',
            payload: {
                customer: e,
                curPage: 1,
                totalList: [],
            },
        });
    }
    // 点击取消的时候搜索全部
    handleSearchALL = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'saleOrderList/getList',
            payload: {
                customer: '',
                curPage: 1,
                totalList: [],
            },
        });
    };
    onEndReached = event => {
        const { dispatch, saleOrderList } = this.props;
        const { total, totalList, curPage } = saleOrderList;
        let currentPage = curPage;
        currentPage++;
        if (totalList.length < total) {
            setTimeout(() => {
                dispatch({
                    type: 'saleOrderList/getList',
                    payload: {
                        loadingMore: true,
                        curPage: currentPage,
                    },
                });
            }, 600);
        } else {
            dispatch({
                type: 'saleOrderList/updateReducer',
                payload: {
                    loadingMore: false,
                },
            });
        }
    };

    render() {
        const {
            saleOrderList: { totalList, loadingMore, customer, checkStatusMap, statusMap },
        } = this.props;
        const row = rowData => {
            return (
                <Link to={`/saleOrderList/orderDetail/${rowData.orderId}`}>
                    <ListCard
                        key={rowData.id}
                        title={{
                            titleLeft: rowData.orderNum,
                            titleRight: checkStatusMap[rowData.checkStatus],
                            showTag: rowData.isDiscount,
                            tagText: '特价',
                        }}
                        content={{
                            lineFirst: rowData.customerName,
                            lineSecond: rowData.createTime,
                            lastLine: rowData.allAmount,
                            totalMoney: '订单总额:',
                            remark: `（${statusMap[rowData.orderStatus]}）`,
                        }}
                    />
                </Link>
            );
        };
        const separator = (sectionID, rowID) => (
            <div
                key={rowID}
                style={{
                    backgroundColor: '#f2f2f2',
                    height: 8,
                }}
            />
        );
        return (
            <div>
                <SearchBar
                    onSubmit={this.handleInputTextSearch.bind(this)}
                    placeholder="请输入总单号/子单号/客户名称/手机号"
                    onCancel={this.handleSearchALL}
                    onChange={this.handleChangeSearchText}
                    value={customer}
                />
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(totalList)}
                    renderRow={row}
                    useBodyScroll
                    renderSeparator={separator}
                    onEndReached={this.onEndReached}
                    renderFooter={() => (
                        <div style={{ padding: 30, textAlign: 'center' }}>
                            {loadingMore ? 'Loading...' : '没有更多数据了'}
                        </div>
                    )}
                />
            </div>
        );
    }
}
