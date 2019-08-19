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
// 自动登陆
export async function reqAuth() {
    return request('/erp-site/check-token', {
        method: 'POST',
        body: {
            data: {
                access_token: localStorage.getItem('token'),
            },
        },
    });
}
