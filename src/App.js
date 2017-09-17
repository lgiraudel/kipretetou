import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import Items from './Items.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddForm: false
    };
  }

  handleClick = e => {
    this.setState({
      ...this.state,
      showAddForm: true
    });
  }

  handleAddFormClose = () => {
    this.setState({
      ...this.state,
      showAddForm: false
    });
  }

  render() {
    const { Header, Content, Footer } = Layout;

    return (
      <Layout>
        <Header>
          <div style={{display: 'flex', height: '100%'}}>
            <div style={{flexGrow: 1, color: 'white', fontSize: 24}}>Kiprêtetou</div>
            <Button icon="plus-circle" onClick={this.handleClick} style={{marginTop: '1.5em'}}>Ajouter un objet</Button>
          </div>
        </Header>
        <Content>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Items showAddForm={this.state.showAddForm} onAddFormClose={this.handleAddFormClose} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          kipretetou ©2017
        </Footer>
      </Layout>
    );
  }
}

export default App;
