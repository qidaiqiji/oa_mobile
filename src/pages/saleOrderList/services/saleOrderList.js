import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetOrderDetail(params) {
    return request(`/sale/order-group/list?${stringify(params)}`);
}
export async function reqGetConfig() {
    return request('/sale/order-group/get-status-map');
  }

