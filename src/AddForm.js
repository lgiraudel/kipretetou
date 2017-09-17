import React, { Component } from 'react';
import { Input, Modal, Form } from 'antd';
import _ from 'lodash';

import retrieveSheet from './Spreadsheet.js';
import AutoComplete from './AutoComplete.js';

const AddForm = Form.create()(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      sheet: null,
      categories: []
    };
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
        categories: _.uniq(cells.map(cell => cell.value))
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