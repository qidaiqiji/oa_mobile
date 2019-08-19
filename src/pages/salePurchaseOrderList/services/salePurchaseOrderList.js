import request from '@/services/request';
import { stringify } from 'qs';
export async function reqList(params) {
    return request(`/purchase/purchase-order/list?${stringify(params)}`);
}
