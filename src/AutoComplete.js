import React, { PureComponent } from 'react';
import AntdAutoComplete from 'antd/lib/auto-complete';
import 'antd/lib/auto-complete/style/css';

export default class AutoComplete extends PureComponent {
  state = {
    datasource: this.props.datasource
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      datasource: nextProps.datasource
    });
  }

  render() {
    const { datasource } = this.state;
    const { placeholder } = this.props;

    return (
      <AntdAutoComplete
        dataSource={datasource}
        placeholder={placeholder}
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      >
      </AntdAutoComplete>
    );
  }
}