import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {Search, Table, updateSearchTopStoriesState} from './App';

Enzyme.configure({ adapter: new Adapter() });


describe('App', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Search', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
    sortKey: 'TITLE',
    isSortReverse: false,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
  });

  it('has a valid snapshot', () => {
    const component = renderer.create(
    <Table { ...props } />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders two rows', () =>{
    const component = shallow(<Table {...props}/>);
    expect(component.find('.table-row').length).toBe(2);
  })
});

describe ('updateSearchTopStoriesState', () => {
  it('changes the state correctly', () => {
    let state = {
      results: null,
      searchKey: 'Redux', }
      let list =  [{ title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }]
      let newState = updateSearchTopStoriesState(list, 1)(state);
      console.log(newState);
  })
})
  