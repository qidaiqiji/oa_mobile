import React, { PureComponent, Fragment } from 'react';
import { Card, WhiteSpace } from 'antd-mobile';
import styles from './index.less';
class ListCard extends PureComponent {
    render() {
        const { content, title } = this.props;
        return (
            <Fragment>
                <Card>
                    <Card.Header
                        title={
                            <div className={styles.title}>
                                <span style={{ fontWeight: 'bold' }}>{title.titleLeft}</span>
                                {title.showTag ? (
                                    <span className={styles.tag}>{title.tagText}</span>
                                ) : null}
                            </div>
                        }
                        extra={
                            <span style={{ color: 'red', fontSize: '0.28rem' }}>
                                {title.titleRight}
                            </span>
                        }
                    />
                    <Card.Body>
                        <p>{content.lineFirst}</p>
                        <p className={styles.line}>{content.lineSecond}</p>
                        <p className={styles.line}>
                            {content.relateNo}
                            <span>{content.lineThird}</span>
                        </p>
                        <p className={styles.line}>
                            {content.totalMoney}
                            <span style={{ fontWeight: 'bold' }}>￥{content.lastLine}</span>
                            <span style={{ color: 'red' }}>{content.remark}</span>
                        </p>
                    </Card.Body>
                </Card>
            </Fragment>
        );
    }
}
export default ListCard;
