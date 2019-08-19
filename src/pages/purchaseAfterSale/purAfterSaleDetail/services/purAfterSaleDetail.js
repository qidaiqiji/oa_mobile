import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetPurAfterSaleDetail(params) {
    return request(`/purchase/purchase-back-order/detail?${stringify(params)}`);
}
export async function reqBossConfirm(params) {
    return request(`/purchase/purchase-back-order/manager-check?${stringify(params)}`);
}
export async function reqOrderAction(url,id,remark) {
    return request(`${url}?${stringify({
        id,
        remark,
    })}`);
}