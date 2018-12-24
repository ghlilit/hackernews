import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {updateSearchTopStoriesState} from '.';

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

describe ('updateSearchTopStoriesState', () => {

  it('changes the state correctly', () => {
    let state = {
      results: null,
      searchKey: 'Redux', }
      let list =  [{ title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }]
      let newState = updateSearchTopStoriesState(list, 1)(state);
      expect(newState.results.Redux.hits).toEqual(list);
  })

})
  