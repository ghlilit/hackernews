import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

  }

  onSearchSubmit() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    }
    
  setSearchTopStories(result) {
    this.setState({ result });
    }
    
  onDismiss(id){
      const isNotId = item => item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({
        result: { ...this.state.result, hits: updatedHits }
        });
        
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
    }
    

  onSearchChange(event){
      const { searchTerm } = this.state;
      this.setState({searchTerm: event.target.value})
      this.fetchSearchTopStories(searchTerm);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    }
    
  render() {
    const {searchTerm, result} = this.state;
    if(!result){return null};
    return (
      <div className="page">
      <div className="interactions">
        <Search
         value = {searchTerm}
         onChange = {this.onSearchChange}
         onSubmit={this.onSearchSubmit}
         > Search</Search>
      </div>
        <Table
        list = {result.hits}
        onDismiss = {this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({
    value,
    onChange,
    onSubmit,
    children
  }) =>
    <form onSubmit={onSubmit}>
    <input
    type="text"
    value={value}
    onChange={onChange}
    />
      <button type="submit">
          {children}
      </button>
  </form>
  
  
  const Table = ({ list, pattern, onDismiss }) => 
      (
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
                onClick={() => onDismiss(item.objectID)}
              >
                Dismiss
              </Button>
            </span>
          </div>
        )};
        </div>
        );
    
const Button = ({onClick, className = ' ',children}) =>
          (<button 
            onClick = {onClick}
            className = {className}
            type = "button"
            >
            {children}
          </button>
        );

export default App;
