import React from 'react'

const withRouter = Component => {
  return Component
}

const BrowserRouter = ({ children }) => <div>{children}</div>

export { withRouter, BrowserRouter }
