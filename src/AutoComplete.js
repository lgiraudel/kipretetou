import React, { Component } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';

export default class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasource: this.props.datasource
    };
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