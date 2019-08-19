import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetDetail(params) {
    return request(`/finance/purchase-outcome-application/detail?${stringify(params)}`);
}
export async function reqGetConfig(params) {
    return request('/finance/purchase-outcome-application/config');
}
export async function reqAction(url, params) {
    return request(`${url}?${stringify(params)}`);
}
