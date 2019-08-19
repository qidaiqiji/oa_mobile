import request from '@/services/request';
import { stringify } from 'qs';
export async function reqGetInfo(params) {
    return request(`/customer/customer/get-user-by-phone?${stringify(params)}`);
}

export async function reqSubmit(params) {
    return request('/customer/customer/set-probation-users', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
