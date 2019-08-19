import {
    reqGetDetail,
    reqAction,
    reqGetConfig,
    reqRejectAction,
} from './services/commonPurchaseDetail';
import { Toast } from 'antd-mobile';
import Router from 'umi/router';
export default {
    namespace: 'commonPurchaseDetail',
    state: {
        id: '',
        status: '',
        supplier: '',
        goodsInfos: [],
        isShowFinanceNotes: false,
        isShowOpreationRecord: false,
        goodsInfos: [],
        isShowGoodsListModal: false,
        gifts: [],
        operaRecord: [],
        payTypeMap: {},
        payType: '',
        actionList: [],
    },
    effects: {
        *getList({ payload }, { put, call }) {
            Toast.loading('加载中...', 0);
            try {
                const res = yield call(reqGetDetail, { purchaseOrderId: payload.id });
                if (+res.code === 0) {
                    Toast.hide();
                }
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res.data,
                        ...payload,
                    },
                });
            } catch (err) {
                Toast.loading('加载失败', 1);
                console.log(err);
            }
        },
        *reqGetConfig({ payload }, { put, call }) {
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
        *clickOkAction({ payload }, { put, call, select }) {
            const { actionUrl, remark } = payload;
            const { status } = yield select(state => state.commonPurchaseDetail);
            try {
                const res = yield call(reqAction, actionUrl, { id: payload.id, remark });
                if (+res.code === 0) {
                    Toast.success(res.msg, 1);
                } else {
                    Toast.fail(res.msg, 1);
                }
                Router.go(-1);
            } catch (err) {
                Toast.loading('错误', 1);
                console.log(err);
            }
        },
        *unmount({ _ }, { put }) {
            yield put({
                type: 'unmountReducer',
            });
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
                goodsInfos: [],
                isShowGoodsListModal: false,
                gifts: [],
                operaRecord: [],
                payTypeMap: {},
                payType: '',
                totalConifg: {},
                actionList: [],
            };
        },
    },
};
