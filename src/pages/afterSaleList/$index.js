/**
 * title: 销售售后单列表
 */
import React, { PureComponent } from 'react';
import { SearchBar, ListView, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ListCard from '../../components/ListCard';
import { bold } from 'ansi-colors';
@connect(state => ({
    afterSaleList: state.afterSaleList,
}))
export default class afterSaleList extends PureComponent {
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
            type: 'afterSaleList/getList',
            payload: {
                status: this.props.match.params.index,
            },
        });
        dispatch({
            type: 'afterSaleList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleList/unmountReducer',
        });
    }
    handleInputTextSearch(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleList/getList',
            payload: {
                mSaleSearchInfo: e,
                totalList: [],
                curPage: 1,
            },
        });
    }
    handleChangeKeyWords = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleList/updateReducer',
            payload: {
                mSaleSearchInfo: e,
            },
        });
    };
    handleSearchAll = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleList/getList',
            payload: {
                mSaleSearchInfo: '',
                totalList: [],
                curPage: 1,
            },
        });
    };
    onEndReached = event => {
        const { dispatch, afterSaleList } = this.props;
        const { curPage, total, totalList } = afterSaleList;
        let currentPage = curPage;
        currentPage++;
        if (totalList.length < total) {
            setTimeout(() => {
                dispatch({
                    type: 'afterSaleList/getList',
                    payload: {
                        loadingMore: true,
                        curPage: currentPage,
                    },
                });
            }, 600);
        } else {
            dispatch({
                type: 'afterSaleList/updateReducer',
                payload: {
                    loadingMore: false,
                },
            });
        }
    };
    render() {
        const {
            afterSaleList: {
                totalList,
                loadingMore,
                mSaleSearchInfo,
                orderTypeMap,
                checkStatusMap,
            },
        } = this.props;
        const row = rowData => {
            return (
                <Link to={`/afterSaleList/afterSaleDetail/${rowData.id}`}>
                    <ListCard
                        key={rowData.id}
                        title={{
                            titleLeft: rowData.backOrderSn,
                            titleRight: checkStatusMap[rowData.checkStatus],
                            showTag: rowData.isReject,
                            tagText: '驳回',
                        }}
                        content={{
                            lineFirst: rowData.customer,
                            lineSecond: rowData.createTime,
                            lastLine: rowData.amount,
                            totalMoney: '退款总额:',
                            remark: `（${orderTypeMap[rowData.type]}）`,
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
                    placeholder="请输入退货单号/关联单号/客户名称/手机号"
                    onChange={this.handleChangeKeyWords}
                    onCancel={this.handleSearchAll}
                    value={mSaleSearchInfo}
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
