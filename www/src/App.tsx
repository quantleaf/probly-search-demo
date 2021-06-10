import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Table from 'react-bootstrap/Table';

import './theme.scss';
import * as w from 'probly-search-demo/probly_search_demo';
w.greet('hello!');


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{display:'inline-flex'}}>
          Demo app for the&nbsp;
          <a
            href="https://github.com/quantleaf/probly-search"
            target="_blank"
            rel="noopener noreferrer"
          >
          probly-search
          </a>&nbsp;library
        </div>
      </header>
      <div style={{display: 'flex', flexDirection: 'column', maxWidth: '500px',  width: '100%', marginTop: '20px',alignItems: 'center'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row',alignItems: 'center'}}>
            <h3>Add Document</h3>
            <input placeholder="Hello word" style={{ marginLeft: '20px'}}></input>
            <Button size="sm" style={{marginLeft: '20px'}}>Save</Button>
        </div>
       
      
        <div style={{width: '100%', display: 'flex', flexDirection: 'row',alignItems: 'center'}}>
          
          <h3>Search</h3>
          <input placeholder="Alice" style={{marginLeft: '20px'}}></input>
          <ButtonToolbar style={{flexDirection:'row', width: '100px', flexWrap: 'initial', marginLeft: '20px'}}>
              <ButtonGroup size="sm">
                <Button>BM25</Button>
              </ButtonGroup>
              <ButtonGroup size="sm" style={{marginLeft: '10px'}}>
                <Button style={{whiteSpace: 'nowrap'}}>zero-to-one</Button>
              </ButtonGroup>   
            </ButtonToolbar>
        </div>
      </div>
      <Table striped bordered hover style={{margin: '20px', maxWidth: '500px'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Document</th>
            <th>BM25 Score</th>
            <th>zero-to-one Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>hey</td>
            <td>0.0002</td>
            <td>0.0002</td>
          </tr>
          <tr>
            <td>2</td>
            <td>hey</td>
            <td>0.0002</td>
            <td>0.0002</td>
          </tr>
        </tbody>
      </Table>
          
    </div>
  );
}

export default App;
