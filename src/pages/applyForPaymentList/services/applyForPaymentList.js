import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetList(params) {
    return request(`/finance/purchase-outcome-application/list?${stringify(params)}`);
}
export async function reqGetConfig() {
    return request('/finance/purchase-outcome-application/config');
}
