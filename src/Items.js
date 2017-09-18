import React, { PureComponent } from 'react';
import _clone from 'lodash/clone';
import _conforms from 'lodash/conforms';
import _filter from 'lodash/filter';
import _isEmpty from 'lodash/isEmpty';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Popconfirm from 'antd/lib/popconfirm';
import 'antd/lib/table/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/popconfirm/style/css';

import AddForm from './AddForm.js';
import retrieveSheet from './Spreadsheet.js';
import './Item.css';

const alphaSorter = (field) => (a, b) => a[field] < b[field] ? 1 : -1;

export default class Items extends PureComponent {
  state = {
    data: [],
    originalData: [],
    sheet: null,
    loading: false,
    searchInfos: {}
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      loading: true
    });

    retrieveSheet.then(sheet => {
      this.setState({
        ...this.state,
        sheet: sheet
      });
      this.refreshData();
    });
  }

  refreshData() {
    this.loading(true);

    this.state.sheet.getRows({
      offset: 1,
      orderby: 'item'
    }, (err, rows) => {
      const dataRows = rows.map((row, i) => ({
        key: `row-${i}`,
        item: row.item,
        category: row.category,
        owner: row.owner,
        img: row.pictureurl,
        row: row
      }));

      this.setState({
        ...this.state,
        originalData: dataRows,
        data: _clone(dataRows),
        searchInfos: {}
      });
      this.loading(false);
    });
  }

  loading(loading) {
    this.setState({
      ...this.state,
      loading: loading
    });
  }

  filterHandler = field => e => {
    const searchText = e.target.value;

    const searchInfos = {
      ...this.state.searchInfos,
      [field]: searchText
    };

    const searchRegexp = Object.keys(searchInfos).reduce((regex, key) => {
      regex[key] = o => o.match(new RegExp(searchInfos[key], 'gi'));
      return regex;
    }, {});

    const data = this.state.originalData.map(record => {
      const match = _conforms(searchRegexp);

      if (_isEmpty(_filter([record], match))) {
        return null;
      }

      let newRecord = {
        ...record
      };
      for (let key in searchInfos) {
        const reg = new RegExp(searchInfos[key], 'gi');
        const match = record[key].match(reg);

        let val = record[key];
        if (match) {
          val = record[key].split(reg).map((text, i) => (
            i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
          ));
        }

        newRecord[key] = (
          <span>
            {val}
          </span>
        )
      }

      return newRecord;
    }).filter(record => !!record);

    this.setState({
      ...this.state,
      searchInfos: searchInfos,
      data: data
    });
  }

  renderFilterDropdown = field => (
    <Input
      placeholder={`Search ${field}`}
      value={this.state.searchInfos[field]}
      onChange={this.filterHandler(field)}
    />
  )

  renderFilterIcon = field => (
    <Icon type="filter" style={{ color: this.state.searchInfos[field] ? '#108ee9' : '#aaa' }} />
  )

  onModalClose = () => {
    this.refreshData();
    this.props.onAddFormClose();
  }

  handleDelete = record => () => {
    record.row.del(() => this.refreshData());
  }

  render() {
    const columns = [{
        title: 'Objet à prêter',
        dataIndex: 'item',
        key: 'item',
        sorter: alphaSorter('item'),
        filterDropdown: this.renderFilterDropdown('item'),
        filterIcon: this.renderFilterIcon('item')
      },{
        title: 'Categorie',
        dataIndex: 'category',
        key: 'category',
        sorter: alphaSorter('category'),
        filterDropdown: this.renderFilterDropdown('category'),
        filterIcon: this.renderFilterIcon('category')
      },{
        title: 'Propriétaire',
        dataIndex: 'owner',
        key: 'owner',
        sorter: alphaSorter('owner'),
        filterDropdown: this.renderFilterDropdown('owner'),
        filterIcon: this.renderFilterIcon('owner')
      },{
        title: '',
        key: 'action',
        render: (text, record) => (
          <Popconfirm title="Etes-vous sur de vouloir supprimer cet objet ?" onConfirm={this.handleDelete(record)} okText="Voui" cancelText="Oula, non non non !">
            <Button shape="circle" icon="delete"/>
          </Popconfirm>
        )
      }];

    return (
      <div>
        {this.props.showAddForm && <AddForm onClose={this.onModalClose}/>}
        <Table columns={columns} dataSource={this.state.data} locale={{emptyText: 'No data'}} loading={this.state.loading} pagination={false} />
      </div>
    );
  }
}
