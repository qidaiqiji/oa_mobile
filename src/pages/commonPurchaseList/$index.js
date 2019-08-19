/**
 * title: 库存采购单列表
 */
import React, { PureComponent, Fragment } from 'react';
import { SearchBar, Card, ListView, Toast } from 'antd-mobile';
import { connect } from 'dva';
import Link from 'umi/link';
import ListCard from '../../components/ListCard';
import withRouter from 'umi/withRouter';
@connect(state => ({
    commonPurchaseList: state.commonPurchaseList,
}))
export default class CommonPurchaseList extends PureComponent {
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
            type: 'commonPurchaseList/getList',
            // payload: {
            //     status: this.props.match.params.index,
            // },
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseList/unmount',
        });
    }
    onEndReached = e => {
        const { dispatch, commonPurchaseList } = this.props;
        const { curPage, totalList, total } = commonPurchaseList;
        let currentPage = curPage;
        currentPage++;
        if (totalList.length < total) {
            setTimeout(() => {
                dispatch({
                    type: 'commonPurchaseList/getList',
                    payload: {
                        curPage: currentPage,
                        loadingMore: true,
                    },
                });
            }, 600);
        } else {
            dispatch({
                type: 'commonPurchaseList/updatePageReducer',
                payload: {
                    loadingMore: false,
                },
            });
        }
    };
    handleChangeSearchText = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseList/updatePageReducer',
            payload: {
                mPurchaseSupplierInfo: e,
            },
        });
    };
    handleSearch = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseList/getList',
            payload: {
                mPurchaseSupplierInfo: e,
                curPage: 1,
                totalList: [],
            },
        });
    };
    handleSearchALL = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseList/getList',
            payload: {
                mPurchaseSupplierInfo: '',
                curPage: 1,
                totalList: [],
            },
        });
    };
    render() {
        const {
            commonPurchaseList: { totalList, loadingMore, mPurchaseSupplierInfo },
        } = this.props;
        const row = rowData => {
            return (
                <Link
                    to={`/commonPurchaseList/commonPurchaseDetail/${rowData.id}`}
                    key={rowData.id}
                >
                    <ListCard
                        key={rowData.id}
                        title={{
                            titleLeft: rowData.id,
                            titleRight: rowData.statusName,
                            showTag: rowData.isCredit,
                            tagText: '账期',
                        }}
                        content={{
                            lineFirst: rowData.supplier,
                            lineSecond: rowData.time,
                            lastLine: rowData.money,
                            totalMoney: '采购总额：',
                            // remark: '（未付款）',
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
        const footer = () => (
            <div style={{ padding: 30, textAlign: 'center' }}>
                {loadingMore ? 'Loading...' : '没有更多数据了'}
            </div>
        );
        return (
            <div>
                <SearchBar
                    placeholder="请输入采购单号/供应商名称"
                    onSubmit={this.handleSearch}
                    onCancel={this.handleSearchALL}
                    onChange={this.handleChangeSearchText}
                    value={mPurchaseSupplierInfo}
                />
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(totalList)}
                    renderRow={row}
                    useBodyScroll
                    renderSeparator={separator}
                    onEndReached={this.onEndReached}
                    renderFooter={footer}
                />
            </div>
        );
    }
}
