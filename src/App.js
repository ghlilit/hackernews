import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import PropTypes from 'prop-types';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

class App extends Component {
  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => this.setState({ error }));
  }
  
  onSearchSubmit = (event) => {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
      }
  }
    
  setSearchTopStories = (result) => {
    const {hits, page} = result;
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
    const updatedHits = [...oldHits, ...hits]
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }  
    });
  }
    
  onDismiss = id => {
      const { searchKey, results } = this.state;
      const { hits, page } = results[searchKey];
      const updatedHits = hits.filter(item => item.objectID !== id);
      this.setState({
        results: {
          ...results,
          [searchKey]: {hits: updatedHits, page}}
      });
  }
    
  onSearchChange = (event) => {
      const { searchTerm } = this.state;
      this.setState({searchTerm: event.target.value})
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm);
  }
    
  render() {
    const {searchTerm, results, searchKey, error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0 ;
    const list = (results && results[searchKey] && results[searchKey].hits) || [] ;
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
        {error 
        ? <div className="interactions">
            <p>Something went wrong</p>         
          </div>
        : <Table
          list = {list}
          onDismiss = {this.onDismiss} />}
          <div className = "text-center">
            <Button onClick = {() => this.fetchSearchTopStories(searchKey, page + 1)}>
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

Search.PropTypes = {
   value: PropTypes.string,
   onChange: PropTypes.func.isRequired,
   onSubmit: PropTypes.func.isRequired,
}
  
  const Table = ({ list, onDismiss }) => 
    <div className="table">
      {list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>
            {item.author}
          </span>
          <span style={{ width: '10%' }}>
            {item.num_comments}
          </span>
          <span style={{ width: '10%' }}>
            {item.points}
          </span>
          <span style={{ width: '10%' }}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline">
              Dismiss
            </Button>
          </span>
        </div>
      )};
    </div>

    Table.PropTypes = {
      list: PropTypes.arrayOf(
        PropTypes.shape({
          objectID: PropTypes.string.isRequired,
          url:PropTypes.string,
          author:PropTypes.string,
          num_comments:PropTypes.number,
          points:PropTypes.number,
        }).isRequired
      ),
      onDismiss: PropTypes.func.isRequired,
    }
    
const Button = ({onClick, className , children}) =>
  <button 
    onClick = {onClick}
    className = {className}
    type = "button">
    {children}
  </button>

Button.defaultProps = {
  className = 'btn btn-default'
}
Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
export default App;

export {Button, Search, Table};
