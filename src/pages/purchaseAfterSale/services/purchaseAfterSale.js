import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetList(params) {
    return request(`/purchase/purchase-back-order/list?${stringify(params)}`);
}
export async function reqGetConfig(params) {
    return request(`/purchase/purchase-back-order/config?${stringify(params)}`);
}
