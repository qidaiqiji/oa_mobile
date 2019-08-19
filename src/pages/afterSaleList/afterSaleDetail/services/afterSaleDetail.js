import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetAfterSaleDetail(params) {
    return request(`/sale/back-order/info?${stringify(params)}`);
}
export async function reqOrderAction(url, id, remark) {
    return request(`${url}?${stringify({
        id,
        remark,
    })}`);
}
// export async function reqBossCheckSureVerify(params) {
//     return request(
//         `/sale/back-order/manage-check?${stringify({
//             ...params,
//         })}`
//     );
// }
