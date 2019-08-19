import request from '@/services/request';
import { stringify } from 'qs';
export async function reqList(params) {
    return request(`/sale/order-group/order-list?${stringify(params)}`);
}
