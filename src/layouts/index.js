import React, { PureComponent } from 'react';
import MenuBar from '@/components/MenuBar';
import NProgress from 'nprogress';
import Exception from './ExceptionLayout';
import withRouter from 'umi/withRouter';
import Router from 'umi/router';
import { connect } from 'dva';
import '@/layouts/nprogress.less';

NProgress.configure({ showSpinner: false });
let currHref = '';
@connect(state => ({
    globalModel: state.globalModel,
}))
class BasicLayout extends PureComponent {
    componentDidMount() {
        const { dispatch, globalModel } = this.props;
        const pathname = this.props.location.pathname;
        const { isLogin } = globalModel;
        if (pathname == '/' || !isLogin) {
            dispatch({
                type: 'globalModel/autoLogin',
                payload: {
                    pathname,
                },
            });
        }
    }
    render() {
        const { children, location, loading, route } = this.props;
        const { href } = window.location; // 浏览器地址栏中地址
        if (currHref !== href) {
            // currHref 和 href 不一致时说明进行了页面跳转
            NProgress.start(); // 页面开始加载时调用 start 方法
            if (!loading.global) {
                // loading.global 为 false 时表示加载完毕
                NProgress.done(); // 页面请求完毕时调用 done 方法
                currHref = href; // 将新页面的 href 值赋值给 currHref
            }
        }
        const path = location.pathname;
        if (path === '/dashboard' || path === '/login') {
            return <div>{children}</div>;
        }

        return (
            <div style={{ overflowX: 'hidden' }}>
                <MenuBar pathname={path} routes={route.routes}>
                    {children}
                </MenuBar>
            </div>
        );
    }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(BasicLayout));
