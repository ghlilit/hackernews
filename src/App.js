import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {sortBy} from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {
  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
    sortKey: 'NONE',
    isSortReverse: false
  }

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse
    this.setState({sortKey, isSortReverse})
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
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
    const updatedHits = [...oldHits, ...hits]
    this.setState({
      isLoading:false,
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
      this.setState({searchTerm: event.target.value})
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm);
  }
    
  render() {
    const {searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse} = this.state;
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
          isSortReverse = {isSortReverse}
          list = {list}
          onDismiss = {this.onDismiss} 
          sortKey = {sortKey}
          onSort = {this.onSort}/>}
          <div className = "text-center">
            <ButtonWithLoading 
            isLoading = {isLoading}
            onClick = {() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
            </ButtonWithLoading>
          </div>
          <br/> <br/>
      </div>
    );
  }
}

class Search extends Component {
  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }
  render(){
    const { value, onChange, onSubmit, children } = this.props;
    return(
      <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref = {(node) => this.input = node}/>
        <button type="submit">
          {children}
        </button>
    </form>  
    )
  }
}
 
Search.propTypes = {
   value: PropTypes.string,
   onChange: PropTypes.func.isRequired,
   onSubmit: PropTypes.func.isRequired,
}
  
  const Table = ({ list, sortKey, onSort, onDismiss, isSortReverse}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse 
  ? sortedList.reverse()
  : sortedList ;
  return (
    <div className="table">
      <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort
              sortKey = {'TITLE'}
              onSort = {onSort}
              activeSortKey={sortKey}>
              Title
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              activeSortKey={sortKey}
              sortKey = {'AUTHOR'}
              onSort = {onSort}>
              Author
            </Sort> 
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              activeSortKey={sortKey}
              sortKey = {'COMMENTS'}
              onSort = {onSort}>
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey = {'POINTS'}
              activeSortKey={sortKey}
              onSort = {onSort}>
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            Archive
          </span>
        </div>
      {reverseSortedList.map(item =>
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
  );
}

    Table.propTypes = {
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
  className: 'btn btn-default'
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

const Loading = () => 
  <div>Loading...</div>

const withLoading = (Component) => ({isLoading, ...rest}) => (
  isLoading  
  ? <Loading />
  : <Component {...rest} />
)

const ButtonWithLoading = withLoading(Button);

const Sort = ({sortKey, onSort, children, activeSortKey}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
    );
  return(
    <Button
      className = {sortClass}
      onClick = {() => onSort(sortKey)}>
      {children} 
    </Button> 
  );
}

export default App;

export {Button, Search, Table};
