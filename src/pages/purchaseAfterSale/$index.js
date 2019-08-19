/**
 * title: 采购售后单列表
 */
import React, { PureComponent } from 'react';
import { SearchBar, ListView } from 'antd-mobile';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ListCard from '../../components/ListCard';
@connect(state => ({
    purchaseAfterSale: state.purchaseAfterSale,
}))
export default class purchaseAfterSale extends PureComponent {
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
            type: 'purchaseAfterSale/getList',
            payload: {
                status: this.props.match.params.index,
            },
        });
        dispatch({
            type: 'purchaseAfterSale/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAfterSale/unmountReducer',
        });
    }
    handleInputTextSearch(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAfterSale/getList',
            payload: {
                mPurSearchInfo: e,
                totalList: [],
                curPage: 1,
            },
        });
    }
    handleChangeKeyWords = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAfterSale/updateReducer',
            payload: {
                mPurSearchInfo: e,
            },
        });
    };
    handleSearchAll = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAfterSale/getList',
            payload: {
                mPurSearchInfo: '',
                totalList: [],
                curPage: 1,
            },
        });
    };
    onEndReached = event => {
        const { dispatch, purchaseAfterSale } = this.props;
        const { curPage, total, totalList } = purchaseAfterSale;
        let currentPage = curPage;
        currentPage++;
        if (totalList.length < total) {
            setTimeout(() => {
                dispatch({
                    type: 'purchaseAfterSale/getList',
                    payload: {
                        loadingMore: true,
                        curPage: currentPage,
                    },
                });
            }, 600);
        } else {
            dispatch({
                type: 'purchaseAfterSale/updateReducer',
                payload: {
                    loadingMore: false,
                },
            });
        }
    };
    render() {
        const {
            purchaseAfterSale: { totalList, loadingMore, mPurSearchInfo, orderTypeMap },
        } = this.props;
        const row = rowData => {
            return (
                <Link to={`/purchaseAfterSale/purAfterSaleDetail/${rowData.sn}`}>
                    <ListCard
                        key={rowData.id}
                        title={{
                            titleLeft: rowData.sn,
                            titleRight: rowData.status,
                            // showTag:'',
                            // tagText: '特价',
                        }}
                        content={{
                            lineFirst: rowData.customer,
                            lineSecond: rowData.time,
                            lastLine: rowData.receivableAmount,
                            totalMoney: '退款总额:',
                            relateNo: '关联采购单号：',
                            lineThird: rowData.relatedPurchaseOrderSn,
                            remark: `(${orderTypeMap[rowData.type]})`,
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
                    placeholder="请输入退货单号/关联单号/供应商"
                    onChange={this.handleChangeKeyWords}
                    onCancel={this.handleSearchAll}
                    value={mPurSearchInfo}
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
