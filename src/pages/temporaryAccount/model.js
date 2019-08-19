import { reqGetInfo, reqSubmit } from './services/temporaryAccoumt';
import { Toast } from 'antd-mobile';
import Router from 'umi/router';
import { formatDate } from '../../utils/utils';
const nowTimeStamp = Date.now();
export default {
    namespace: 'temporaryAccoumt',
    state: {
        isOnProbation: false,
        probationStartTime: '',
        probationEndTime: '',
        defaultStartTime: new Date(nowTimeStamp),
        defaultEndTime: new Date(nowTimeStamp + 3 * 3600 * 24 * 1000),
        address: '',
        isOnProbation: '',
        mobilePhone: '',
        regTime: '',
        status: '',
        userId: '',
        butLoading: false,
        phone: '',
    },
    effects: {
        *searchByPhone({ payload }, { put, call, select }) {
            yield put({
                type: 'updateReducer',
                payload: {
                    ...payload,
                },
            });
            const { phone } = yield select(state => state.temporaryAccoumt);
            Toast.loading('加载中...', 0);
            try {
                const res = yield call(reqGetInfo, { mobilePhone: phone });

                yield put({
                    type: 'updateReducer',
                    payload: {
                        ...res.data.userInfo,
                    },
                });
                Toast.hide();
            } catch (err) {
                Toast.fail(err);
                console.log(err);
            }
        },
        *submitInfo({ payload }, { put, call, select }) {
            yield put({
                type: 'updateReducer',
                payload: {
                    butLoading: true,
                },
            });
            const {
                userId,
                probationStartTime,
                probationEndTime,
                isOnProbation,
                defaultStartTime,
                defaultEndTime,
            } = yield select(state => state.temporaryAccoumt);
            let satrtTime = '';
            let endTime = '';
            satrtTime = probationStartTime || formatDate(defaultStartTime);
            endTime = probationEndTime || formatDate(defaultEndTime);
            if (!isOnProbation) {
                satrtTime = '';
                endTime = '';
            }
            try {
                const res = yield call(reqSubmit, {
                    userId,
                    probationStartTime: satrtTime,
                    probationEndTime: endTime,
                    isOnProbation: isOnProbation ? 1 : 0,
                });
                Toast.info(res.msg, 1);
                if (+res.code === 0) {
                    Router.push('/dashboard');
                    yield put({
                        type: 'updateReducer',
                        payload: {
                            butLoading: false,
                        },
                    });
                } else {
                    yield put({
                        type: 'updateReducer',
                        payload: {
                            butLoading: false,
                        },
                    });
                }
            } catch (err) {
                yield put({
                    type: 'updateReducer',
                    payload: {
                        butLoading: false,
                    },
                });
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
                isOnProbation: false,
                probationStartTime: '',
                probationEndTime: '',
                defaultStartTime: new Date(nowTimeStamp),
                defaultEndTime: new Date(nowTimeStamp + 3 * 3600 * 24 * 1000),
                address: '',
                isOnProbation: '',
                mobilePhone: '',
                regTime: '',
                status: '',
                userId: '',
                butLoading: false,
                phone: '',
            };
        },
    },
};
