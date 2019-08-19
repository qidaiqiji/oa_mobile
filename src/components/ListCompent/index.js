import React, { PureComponent,Fragment } from 'react';
import { Card, WhiteSpace } from 'antd-mobile';
// import globalStyle from '@/assets/index.less';
// import PropTypes from 'prop-types';
class ListCard extends PureComponent {
    render() {
        const { titleLeft, titleRight, showTag, tagText } = this.props;
        return (
            <Fragment>
                <Card onClick={this.handleClick}>
                    <Card.Header
                        title={<div>{titleLeft}{showTag?<span className={globalStyle.tag}>{tagText}</span>:null}</div>}
                        extra={<span style={{color:"red"}}>{titleRight}</span>}
                        />
                    <Card.Body>
                        <p></p>
                        <p></p>
                        <p><span style={{fontWeight:'bold'}}></span></p>
                    </Card.Body>
                </Card>
                <WhiteSpace />
                {/* {children ? <div>{children}</div> : null} */}
            </Fragment>
        );
    }
}

// ListCard.defaultProps = {
//     children: null,
//     pathname: '/',
// };

// ListCard.propTypes = {
//     children: PropTypes.node,
//     pathname: PropTypes.string,
// };

export default ListCard;