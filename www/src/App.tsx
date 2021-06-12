

import React, { useState } from 'react';
import './App.scss';
import { ToggleButton, Button, Table, ButtonGroup } from 'react-bootstrap';
import * as Papa from "papaparse";

const problySearch = import('@quantleaf/probly-search-demo');
interface Doc {
  id: number,
  text: string
}
interface Result {
  score: number,
  document: Doc
}

type SearchType = 'bm25' | 'zero-to-one';
const search = async (query: string, method: SearchType): Promise<Result[]> => {
  let results = (await problySearch).search(query, method, 10);
  return JSON.parse(results);
}

const drawResult = (result: Result[]) => {
  return <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
    <span style={{ fontStyle: "italic" }}>Return at most 10 results</span>
    <Table responsive style={{ marginTop: '20px' }}>
      <thead>
        <tr>
          <th>Result</th>
          <th>Score</th>
          <th>Document</th>
        </tr>
      </thead>
      <tbody>
        {
          result.map((r, idx) => {
            return <tr key={idx} >
              <td>{r.document.id}</td>
              <td>{r.score}</td>
              <td>{r.document.text}</td>
            </tr>
          })
        }
      </tbody>
    </Table>
  </div>

}

interface LoaderProps {
  loading: boolean,
  documentsAdded: number,
  totalDocumentsToAdd: number
}
class Loader extends React.Component<any, LoaderProps> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      documentsAdded: 0,
      totalDocumentsToAdd: 1
    }
  }

  componentDidMount() {
    console.log('load once!')
    let c = this;
    problySearch.then((p) => {
      Papa.parse('recipe_names.csv', { // Only one column, so a little overkill to do papaparse
        download: true,
        complete: async (results) => {
          c.setState({
            documentsAdded: c.state.documentsAdded,
            totalDocumentsToAdd: (results.data as any[]).length
          });

          for (let i = 0; i < (results.data as any[]).length; i++) {

            let name = (results.data as any[])[i][0] as any as string;
            p.save(name);
            if (i % 1000 === 0) // a trick to force rerender
            {
              await new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(true);

                }, 0);
              })
              c.setState({
                loading: true,
                documentsAdded: i,
                totalDocumentsToAdd: (results.data as any[]).length
              });

            }
          }
          c.setState({
            loading: false,
            documentsAdded: (results.data as any[]).length,
            totalDocumentsToAdd: (results.data as any[]).length
          });

        }
      });

    })
  }
  render() {
    if (this.state.loading)
      return <div style={{ fontStyle: 'italic', display: 'inline-flex' }}>Adding documents &nbsp;{this.state.documentsAdded}&nbsp;of&nbsp;{this.state.totalDocumentsToAdd}</div>;
    return <div style={{ fontStyle: 'italic', display: 'inline-flex' }}>Index contains&nbsp;{this.state.totalDocumentsToAdd}&nbsp;documents</div>;

  }
}
let lastSearchEvent: any;
const searchTypes = [
  { name: 'zero-to-one', value: 'zero-to-one' as SearchType },
  { name: 'BM25', value: 'bm25' as SearchType }
];
function App() {
  const [result, resultChange] = useState([] as Result[]);
  const [searchType, setSearchTypeValue] = useState('zero-to-one' as SearchType);
  const setSearchTypeValueWithReset = (type: SearchType) => {
    setSearchTypeValue(type)
    if (lastSearchEvent)
      searchChange(lastSearchEvent, type)

  }
  const searchChange = (event: any, type: SearchType = searchType) => {
    lastSearchEvent = event;
    search(event.target.value, type).then((result) => {
      resultChange(result)
    })
  }
  return (
    <div className="App">

      <header className="App-header">
        <div style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
          Recipe search demo app for&nbsp;
          <a
            href="https://github.com/quantleaf/probly-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            probly-search
          </a>&nbsp;library
        </div>
        <div>
          <span className="App-subheader">The library is written in Rust and is running entirely in your web browser using web assembly</span>
        </div>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%', marginTop: '20px' }}>
        <div className="App-box">
          <h5>Search</h5>
          <Loader></Loader>

          <div className="App-row">

            <input placeholder="Garlic Chicken" style={{ marginLeft: '20px' }} onChange={searchChange}></input>
            <ButtonGroup toggle style={{ marginLeft: '20px' }}>
              {
                searchTypes.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={searchType == radio.value}
                    onChange={(e) => setSearchTypeValueWithReset(e.currentTarget.value as SearchType)}
                  >
                    <span>{radio.name}</span>
                  </ToggleButton>
                ))
              }
            </ButtonGroup>
          </div>
          {
            drawResult(result)
          }
        </div>
      </div>
    </div>
  );
}

export default App;


// fragments
/*
 <div className="App-box">
          <h5>Edit index</h5>
          <div className="App-row">

              <input placeholder="My new document" style={{ marginLeft: '20px'}}></input>
              <Button size="sm" style={{marginLeft: '20px'}}>Add document</Button>
              <Button size="sm" variant = "danger" onClick={clear}>Clear index</Button>
          </div>
        </div>
        */