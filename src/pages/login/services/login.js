import request from '@/services/request';
export async function reqLogin(params) {
    return request('/erp-site/login', {
        method: 'POST',
        body: {
            data: {
                ...params,
            },
        },
    });
}
