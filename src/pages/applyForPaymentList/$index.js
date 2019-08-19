/**
 * title: 货款申请单列表
 */
import React, { PureComponent, Fragment } from 'react';
import { SearchBar, Card, ListView, Toast } from 'antd-mobile';
import { connect } from 'dva';
import Link from 'umi/link';
import ListCard from '../../components/ListCard';
@connect(state => ({
    applyForPaymentList: state.applyForPaymentList,
}))
export default class ApplyForPaymentList extends PureComponent {
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
            type: 'applyForPaymentList/getList',
            // payload: {
            //     status: this.props.match.params.index,
            // },
        });
        dispatch({
            type: 'applyForPaymentList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentList/unmount',
        });
    }
    handleChangeSearchText = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentList/updatePageReducer',
            payload: {
                keywords: e,
            },
        });
    };
    handleSearch = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentList/getList',
            payload: {
                keywords: e,
                curPage: 1,
                totalList: [],
            },
        });
    };
    handleSearchALL = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'applyForPaymentList/getList',
            payload: {
                keywords: '',
                curPage: 1,
                totalList: [],
            },
        });
    };
    onEndReached = e => {
        const { dispatch, applyForPaymentList } = this.props;
        const { curPage, totalList, total } = applyForPaymentList;
        let currentPage = curPage;
        currentPage++;
        if (totalList.length < total) {
            setTimeout(() => {
                dispatch({
                    type: 'applyForPaymentList/getList',
                    payload: {
                        curPage: currentPage,
                        loadingMore: true,
                    },
                });
            }, 600);
        } else {
            dispatch({
                type: 'applyForPaymentList/updatePageReducer',
                payload: {
                    loadingMore: false,
                },
            });
        }
    };
    render() {
        const {
            applyForPaymentList: { totalList, loadingMore, statusMap, keywords },
        } = this.props;
        const row = rowData => {
            return (
                <Link
                    to={`/applyForPaymentList/applyForPaymentDetail/${rowData.id}`}
                    key={rowData.id}
                >
                    <ListCard
                        key={rowData.id}
                        title={{
                            titleLeft: rowData.id,
                            titleRight: statusMap[rowData.status],
                            showTag: rowData.isCredit,
                            tagText: '账期',
                        }}
                        content={{
                            lineFirst: rowData.supplier,
                            lineSecond: rowData.time,
                            lastLine: rowData.payTotalAmount,
                            totalMoney: '采购总额：',
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
            <Fragment>
                <SearchBar
                    placeholder="请输入采购单号/供应商名称"
                    onSubmit={this.handleSearch}
                    onCancel={this.handleSearchALL}
                    onChange={this.handleChangeSearchText}
                    value={keywords}
                />
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(totalList)}
                    renderRow={row}
                    useBodyScroll
                    renderSeparator={separator}
                    onEndReached={this.onEndReached}
                    renderFooter={footer}
                />
            </Fragment>
        );
    }
}
