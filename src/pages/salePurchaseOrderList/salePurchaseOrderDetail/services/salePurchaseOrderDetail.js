import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetDetail(params) {
    return request(`/purchase/purchase-order/sale-detail?${stringify(params)}`);
}
export async function reqGetConfig(params) {
    return request(`/purchase/purchase-order/config?${stringify(params)}`);
}
export async function reqAction(url, params) {
    return request(`${url}?${stringify(params)}`);
}
