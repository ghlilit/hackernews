import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

class App extends Component {
  state = {
    result: null,
    searchTerm: DEFAULT_QUERY,
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }
  
  onSearchSubmit = (event) => {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }
    
  setSearchTopStories = (result) => {
    const {hits, page} = result;
    const oldHits = page !== 0
    ? this.state.result.hits
    : [];
    const updatedHits = [...oldHits, ...hits]
    this.setState({
      result: {hits: updatedHits, page} 
    });
  }
    
  onDismiss = id => {
      const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
      this.setState({
        result: { ...this.state.result, hits: updatedHits }
      });
  }
    
  onSearchChange = (event) => {
      const { searchTerm } = this.state;
      this.setState({searchTerm: event.target.value})
  }

  componentDidMount() {
      const { searchTerm } = this.state;
      this.fetchSearchTopStories(searchTerm);
  }
    
  render() {
    const {searchTerm, result} = this.state;
    const page = (result && result.page) || 0 ;
    return (
      <div className="container">
        <div className="interactions">
          <Search
            value = {searchTerm}
            onChange = {this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
          {result &&
          <Table
          list = {result.hits}
          onDismiss = {this.onDismiss} />}
          <div className = "text-center">
            <Button onClick = {() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              More
            </Button>
          </div>
          <br/> <br/>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}/>
      <button type="submit">
        {children}
      </button>
  </form>

  
  const Table = ({ list, onDismiss }) => 
    <div className="table">
      {list.map(item =>
        <div key={item.objectID} className="table-row">
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
            <Button
              className="button-inline"
              onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
      )};
    </div>
    
const Button = ({onClick, className = 'btn btn-primary btn-lg',children}) =>
  <button 
    onClick = {onClick}
    className = {className}
    type = "button">
    {children}
  </button>

export default App;
