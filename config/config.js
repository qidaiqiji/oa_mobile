// https://umijs.org/config/
import path from 'path';
import theme from '../src/theme';

export default {
    // add for transfer to umi
    plugins: [
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: true,
                dynamicImport: {
                    loadingComponent: './components/PageLoading/index',
                    webpackChunkName: true,
                },
                dll: false,
                pwa: false,
                hd: true,
                routes: {
                    exclude: [/services\//],
                },
                hardSource: false,
            },
        ],
    ],
    //   exportStatic: {},
    // 路由配置
    // routes: pageRoutes,
    // Theme for antd-mobile
    // https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
    theme: {
        'brand-primary': theme.primaryColor,
    },
    //   ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    cssnano: {
        mergeRules: false,
    },
    targets: {
        android: 5,
        ios: 7,
        chrome: 58,
        ie: 9,
    },
    exportStatic: false,
    proxy: {
        '/api': {
            target: 'http://t241.erp.xiaomei360.com',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
    outputPath: './dist',
    hash: true,
    alias: {
        '@': path.resolve(__dirname, 'src'),
    },
    define: {
        API_ENV: process.env.API_ENV,
    },
};
