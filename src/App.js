import React, { PureComponent } from 'react';
import Layout from 'antd/lib/layout';
import Button from 'antd/lib/button';
import 'antd/lib/layout/style/css';
import 'antd/lib/button/style/css';
import './App.css';

import Items from './Items.js';

class App extends PureComponent {
  state = {
    showAddForm: false
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
