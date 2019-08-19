import React, { PureComponent } from 'react';
import { Flex } from 'antd-mobile';
import styles from './goodsDetail.less';
export default class GoodsDetail extends PureComponent {
    render() {
        const { resdata } = this.props;
        return (
            <div className={styles.goodsDeailbox}>
                {resdata.img ? <img src={resdata.img} alt="img" /> : ''}
                <div>
                    <p>{resdata.title} </p>
                    {resdata.line1_name ? (
                        <div className={styles.onlinep}>
                            <p>
                                {resdata.line1_name}：<span>￥{resdata.line1_price}</span>
                                {resdata.line1_discount ? (
                                    <span>{resdata.line1_discount}折</span>
                                ) : (
                                    ''
                                )}
                            </p>
                            {resdata.isTaxLine1 ? <span>{resdata.isTaxLine1}</span> : ''}
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line2_name ? (
                        <div className={styles.profit}>
                            {resdata.line2_name}：<span>{resdata.line2_data}</span>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.expectPayTime ? (
                        <Flex justify="between" style={{ marginBottom: 10 }}>
                            <span>
                                {resdata.payText}：
                                <span style={{ color: 'red' }}>{resdata.expectPayTime}</span>
                            </span>
                            <span>
                                {resdata.payMethod}
                                月结
                            </span>
                        </Flex>
                    ) : (
                        ''
                    )}
                    {resdata.subOrderText ? (
                        <div className={styles.profit}>
                            <span>
                                {resdata.subOrderText}：<span>{resdata.subOrder}</span>
                            </span>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line3_name ? (
                        <div className={styles.profit}>
                            {resdata.line3_name}:<span>￥{resdata.line3_data}</span>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line4_name ? (
                        <div className={styles.line4}>
                            <p>
                                {resdata.line4_name}:<span>{resdata.line4_price1}/</span>
                                <span>{resdata.line4_price2}/</span>
                                <span>{resdata.line4_price3}</span>{' '}
                            </p>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line5_name ? (
                        <div className={styles.line5}>
                            <p>
                                {resdata.line5_name}：<span>{resdata.line5_price1}/</span>
                                <span>{resdata.line5_price2}</span>{' '}
                            </p>
                            {resdata.isTax ? <span>{resdata.isTax}</span> : ''}
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line6_name ? (
                        <div className={styles.price}>
                            <p>
                                {resdata.line6_name}：
                                <span style={{ color: resdata.priceColor }}>
                                    ￥{resdata.line6_price1}
                                </span>
                            </p>

                            <span>x{resdata.line6_num}</span>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.purchaseNum ? (
                        <div className={styles.price}>
                            <p>
                                {resdata.purchaseNumText}：<span>{resdata.purchaseNum}</span>
                            </p>
                        </div>
                    ) : (
                        ''
                    )}
                    {resdata.line7_name ? (
                        <div className={styles.price}>
                            <p>
                                {resdata.line7_name}:<span>{resdata.line7_data}</span>
                            </p>
                            {resdata.line7_rightName ? (
                                <span>
                                    {resdata.line7_rightName}
                                    ：￥
                                    {resdata.line7_rightD}
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}
