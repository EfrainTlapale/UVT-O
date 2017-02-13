import React, { Component } from 'react'
import Header from './components/Header'
import Drawer from './components/Drawer'

class App extends Component {
  render () {
    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        <Header />
        <Drawer />
        <main className='mdl-layout__content'>
          <div className='mdl-grid'>
            <div className='page-content'>content</div>
          </div>
        </main>
      </div>
    )
  }
}

export default App
