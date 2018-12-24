import React from 'react';
import axios from 'axios';
import './App.css';
import Table from '../Table'
import Search from '../Search'
import {ButtonWithLoading} from '../Button'

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

export const updateSearchTopStoriesState = (hits, page) => prevState => {
  const {searchKey, results} = prevState;
  const oldHits = results && results[searchKey]
  ? results[searchKey].hits
  : [];

  const updatedHits = [...oldHits, ...hits];
  
  return {
      isLoading: false,
      results: {
      ...results,
      [searchKey]: { hits: updatedHits, page },
    }  
  };
}

export default class App extends React.Component {
  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }
  
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({isLoading:true})
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(result => this.setSearchTopStories(result.data))
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
    this.setState(updateSearchTopStoriesState(hits, page))
  }
  
  onDismiss = id => {
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];
      const updatedHits = hits.filter(item => item.objectID !== id);
      return{
        results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}}
      };
    });
  }
    
  onSearchChange = (event) => {
    this.setState({searchTerm: event.target.value})
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const {searchTerm, results, searchKey, error, isLoading} = this.state;
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
          onDismiss = {this.onDismiss}/>}
        <div className = "text-center">
          <ButtonWithLoading 
            isLoading = {isLoading}
            onClick = {() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
        <br/> <br/>
    </div>
    )
  }
}

