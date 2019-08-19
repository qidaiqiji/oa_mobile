import { reqGetDetail, reqGetConfig, reqAction } from './services/salePurchaseOrderDetail';
import { Toast } from 'antd-mobile';
import Router from 'umi/router';
export default {
    namespace: 'salePurchaseOrderDetail',
    state: {
        id: '',
        status: '',
        supplier: '',
        goodsInfos: [],
        isShowFinanceNotes: false,
        isShowOpreationRecord: false,
        totalOrderGoodsList: [],
        isShowGoodsListModal: false,
        subOrderList: [],
        isShowSubOrder: false,
        selectedSubOrderList: [],
        isShowSubOrderDetail: false,
        operaRecord: [],
        actionList: [],
        payTypeMap: {},
    },
    effects: {
        *getList({ payload }, { put, call }) {
            Toast.loading('加载中...', 0);
            try {
                const res = yield call(reqGetDetail, { id: payload.id });
                Toast.hide();
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res.data,
                        ...payload,
                    },
                });
            } catch (err) {
                Toast.fail('加载失败', 1);
                console.log(err);
            }
        },
        *getConfig({ payload }, { put, call }) {
            try {
                const res = yield call(reqGetConfig);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        payTypeMap: res.data.payTypeMap,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
        *clickOkAction({ payload }, { put, call }) {
            const { actionUrl, remark } = payload;
            try {
                const res = yield call(reqAction, actionUrl, { id: payload.id, remark });
                if (+res.code === 0) {
                    Toast.success(res.msg, 1);
                } else {
                    Toast.fail(res.msg, 1);
                }
                Router.go(-1);
            } catch (err) {
                Toast.fail('失败', 1);
                console.log(err);
            }
        },
    },
    reducers: {
        updatePageReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        unmountReducer() {
            return {
                id: '',
                status: '',
                supplier: '',
                goodsInfos: [],
                isShowFinanceNotes: false,
                isShowOpreationRecord: false,
                totalOrderGoodsList: [],
                isShowGoodsListModal: false,
                subOrderList: [],
                isShowSubOrder: false,
                selectedSubOrderList: [],
                isShowSubOrderDetail: false,
                operaRecord: [],
                actionList: [],
                payTypeMap: {},
            };
        },
    },
};
