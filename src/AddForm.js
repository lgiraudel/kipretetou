import React, { PureComponent } from 'react';
import _uniq from 'lodash/uniq';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import 'antd/lib/input/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/form/style/css';

import retrieveSheet from './Spreadsheet.js';
import AutoComplete from './AutoComplete.js';

const AddForm = Form.create()(class extends PureComponent {
  state = {
    loading: false,
    sheet: null,
    categories: []
}

  componentDidMount() {
    retrieveSheet.then(sheet => {
      this.setState({
        ...this.state,
        sheet: sheet
      });
      this.retrieveCategories();
    });
  }

  retrieveCategories() {
    this.state.sheet.getCells({
      'min-col': 2,
      'max-col': 2,
      'min-row': 2
    }, (err, cells) => {
      this.setState({
        ...this.state,
        categories: _uniq(cells.map(cell => cell.value))
      });
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          ...this.state,
          loading: true
        });

        this.state.sheet.addRow(values, () => {
          this.handleCancel();
        });
      }
    })
  }

  handleCancel = () => {
    this.setState({
      ...this.state,
      loading: true,
    });

    this.props.onClose();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { categories } = this.state;

    return (
      <Modal title="Ajouter un objet à prêter" visible={true} okText="Ajouter" cancelText="Annuler" onOk={this.handleSubmit} onCancel={this.handleCancel} confirmLoading={this.state.loading}>
      <Form>
        <Form.Item label="Nom de l'objet">
          {getFieldDecorator('item', {
            rules: [{
              required: true,
              message: "Veuillez saisir un nom d'objet"
            }]
          })(<Input/>)}
        </Form.Item>

        <Form.Item label="Catégorie">
          {getFieldDecorator('category', {
            rules: [{
              required: true,
              message: 'Veuillez choisir une catégorie'
            }]
          })(<AutoComplete datasource={categories} placeholder="Choisissez une catégorie"><Input /></AutoComplete>)}
        </Form.Item>

        <Form.Item label="Propriétaire">
          {getFieldDecorator('owner', {
            rules: [{
              required: true,
              message: "Veuillez saisir votre nom"
            }]
          })(<Input/>)}
        </Form.Item>
      </Form>
      </Modal>
    );
  }
});

export default AddForm;