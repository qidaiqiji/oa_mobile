import { Toast } from 'antd-mobile';
import Router from 'umi/router';
import {
    reqGetAfterSaleDetail,
    reqOrderAction,
    // reqBossCheckSureVerify,
} from './services/afterSaleDetail';
export default {
    namespace: 'afterSaleDetail',
    state: {
        totalOrder: {},
        goodsList: [],
        goodsListVisible: false,
        rejectModalVisible: false,
        loadingMore: true,
        operateVisible: false,
        afterSaleListVisible: false,
        operationList: '',
        actionList: [],
    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            const {} = yield select(state => state.afterSaleDetail);
            try {
                const res = yield call(reqGetAfterSaleDetail, { ...payload });
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalOrder: res.data,
                        goodsList: res.data.goodsList,
                        operationList: res.data.operationList,
                        actionList: res.data.actionList,
                        ...res.data,
                        ...payload,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
        *clickSureAction({ payload }, { put, call, select }) {
            try {
                const res = yield call(
                    reqOrderAction,
                    payload.actionurl,
                    payload.id,
                    payload.remark
                );
                if (+res.code === 0) {
                    Toast.success(res.msg);
                }
                Router.go(-1);
                yield put({
                    type: 'updateReducer',
                    payload: {
                        ...res.data,
                        ...payload,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
    },
    reducers: {
        updateReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        unmountReducer() {
            return {
                totalOrder: {},
                goodsList: [],
                goodsListVisible: false,
                rejectModalVisible: false,
                loadingMore: true,
                operateVisible: false,
                afterSaleListVisible: false,
                operationList: '',
                actionList: [],
            };
        },
    },
};
