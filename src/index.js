import React from 'react';
import { Button } from 'antd';

export default class GButton extends React.Component {
  render() {
    return <Button {...this.props}>{this.props.children}</Button>;
  }
}
