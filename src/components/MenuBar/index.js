import React, { PureComponent } from 'react';
import { TabBar, NavBar, Icon } from 'antd-mobile';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import Router from 'umi/router';
import PropTypes from 'prop-types';
import BizIcon from '../BizIcon';
class MenuBar extends PureComponent {
    render() {
        const { children, pathname, routes } = this.props;
        return (
            <div>
                <NavBar
                    mode="dark"
                    icon={
                        pathname === '/dashboard' || pathname === '/login' ? null : (
                            <Icon type="left" />
                        )
                    }
                    onLeftClick={() => {
                        if (pathname === '/') {
                            return;
                        } else {
                            Router.go(-1);
                        }
                    }}
                    rightContent={
                        <Link to="/dashboard">
                            <BizIcon type="zhuye1" />
                        </Link>
                    }
                >
                    {routes.map(item => {
                        if (item.path === pathname) {
                            return item.title;
                        } else if (
                            item.path == '/commonPurchaseList/commonPurchaseDetail/:id' &&
                            pathname.indexOf('commonPurchaseDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/afterSaleList/afterSaleDetail/:id' &&
                            pathname.indexOf('afterSaleDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/purchaseAfterSale/purAfterSaleDetail/:id' &&
                            pathname.indexOf('purAfterSaleDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/saleOrderList/orderDetail/:id' &&
                            pathname.indexOf('orderDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/salePurchaseOrderList/salePurchaseOrderDetail/:id' &&
                            pathname.indexOf('salePurchaseOrderDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/applyForPaymentList/applyForPaymentDetail/:id' &&
                            pathname.indexOf('applyForPaymentDetail') > 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/commonPurchaseList/:index' &&
                            pathname.indexOf('commonPurchaseList') > 0 &&
                            pathname.indexOf('commonPurchaseDetail') < 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/afterSaleList/:index' &&
                            pathname.indexOf('afterSaleList') > 0 &&
                            pathname.indexOf('afterSaleDetail') < 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/purchaseAfterSale/:index' &&
                            pathname.indexOf('purchaseAfterSale') > 0 &&
                            pathname.indexOf('purAfterSaleDetail') < 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/saleOrderList/:index' &&
                            pathname.indexOf('saleOrderList') > 0 &&
                            pathname.indexOf('orderDetail') < 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/salePurchaseOrderList/:index' &&
                            pathname.indexOf('salePurchaseOrderList') > 0 &&
                            pathname.indexOf('salePurchaseOrderDetail') < 0
                        ) {
                            return item.title;
                        } else if (
                            item.path == '/applyForPaymentList/:index' &&
                            pathname.indexOf('applyForPaymentList') > 0 &&
                            pathname.indexOf('applyForPaymentDetail') < 0
                        ) {
                            return item.title;
                        }
                    })}
                </NavBar>
                {children ? <div>{children}</div> : null}
            </div>
        );
    }
}

MenuBar.defaultProps = {
    children: null,
    pathname: '/',
};

MenuBar.propTypes = {
    children: PropTypes.node,
    pathname: PropTypes.string,
};

export default MenuBar;
// export default withRouter(connect(({ app, loading }) => ({ app, loading }))());
