import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetOrderDetail(params) {
    return request(`/sale/order-group/info?${stringify(params)}`);
}
export async function reqCheck(url,totalOrderId,remark,id) {
    return request(`${url}&${stringify({
        totalOrderId,
        remark,
        id,
    })}`);
}
// export async function reqBossCheckSureVerify(params) {
//     return request(
//         `/sale/order-group/manager-check?${stringify({
//             ...params,
//             pass: 1,
//         })}`
//     );
// }
export async function reqGetConfig() {
    return request('/sale/order-group/get-status-map');
}
