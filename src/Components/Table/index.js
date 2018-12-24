import React from 'react'
import {sortBy} from 'lodash'
import classNames from 'classnames'
import Button from '../Button'
import PropTypes from 'prop-types';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
  };

class Table extends React.Component {
  
  state = {
    sortKey: 'NONE',
    isSortReverse: false
  }

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse
    this.setState({sortKey, isSortReverse})
  }
  
  render() {
    const { list, onDismiss} = this.props;  
    const { sortKey, isSortReverse } = this.state;  
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
                onSort = {this.onSort}
                activeSortKey={sortKey}>
                Title
              </Sort>
            </span>
            <span style={{ width: '30%' }}>
              <Sort
                activeSortKey={sortKey}
                sortKey = {'AUTHOR'}
                onSort = {this.onSort}>
                Author
              </Sort> 
            </span>
            <span style={{ width: '10%' }}>
              <Sort
                activeSortKey={sortKey}
                sortKey = {'COMMENTS'}
                onSort = {this.onSort}>
                Comments
              </Sort>
            </span>
            <span style={{ width: '10%' }}>
              <Sort
                sortKey = {'POINTS'}
                activeSortKey={sortKey}
                onSort = {this.onSort}>
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
      )
    }
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
    onDismiss: PropTypes.func,
  }
    
const Sort = ({sortKey, onSort, children, activeSortKey}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey });
  return(
    <Button
      className = {sortClass}
      onClick = {() => onSort(sortKey)}>
      {children} 
    </Button> 
  );
}

export default Table;