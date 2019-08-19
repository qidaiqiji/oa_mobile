import { reqGetDetail, reqAction, reqGetConfig } from './services/applyForPaymentDetail';
import { Toast } from 'antd-mobile';
import Router from 'umi/router';
export default {
    namespace: 'applyForPaymentDetail',
    state: {
        id: '',
        status: '',
        supplier: '',
        detail: {},
        payInfo: {},
        purchaseOrderList: [],
        isShowFinanceNotes: false,
        isShowOpreationRecord: false,
        isCredit: false,
        isSale: false,
        isShowGoodsListModal: false,
        isShowSubOrderList: false,
        selectedSubOrderList: [],
        remark: '',
        operaRecord: [],
        payMethodMap: {},
    },
    effects: {
        *getDetail({ payload }, { put, call }) {
            Toast.loading('加载中...', 0);
            try {
                const res = yield call(reqGetDetail, { id: payload.id });
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
                        payMethodMap: res.data.payMethodMap,
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
                    Toast.fail(res.msg, 2);
                }
                Router.go(-1);
            } catch (err) {
                Toast.fail('错误', 1);
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
                detail: {},
                payInfo: {},
                purchaseOrderList: [],
                isShowFinanceNotes: false,
                isShowOpreationRecord: false,
                isCredit: false,
                isSale: false,
                isShowGoodsListModal: false,
                isShowSubOrderList: false,
                selectedSubOrderList: [],
                remark: '',
                operaRecord: [],
                payMethodMap: {},
            };
        },
    },
};
