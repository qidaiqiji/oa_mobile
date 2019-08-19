import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetOrderDetail(params) {
    return request(`/sale/back-order/list?${stringify(params)}`);
}
export async function reqGetConfig(params) {
    return request(`/sale/back-order/config?${stringify(params)}`);
}
