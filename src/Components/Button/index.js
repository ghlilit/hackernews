import React from 'react'
import PropTypes from 'prop-types';

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

export default Button;
export {ButtonWithLoading}