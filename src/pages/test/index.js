import React, { PureComponent } from 'react';
import { Button, Toast } from 'antd-mobile';

class Test extends PureComponent {
    componentDidMount() {}

    showToast = () => {
        Toast.info('This is a toast tips !!!', 10);
    };

    render() {
        const { route } = this.props;
        return (
            <div>
                <Button type="primary" onClick={this.showToast}>
                    {route.title}
                </Button>
            </div>
        );
    }
}

export default Test;
