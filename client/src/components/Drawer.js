import React from 'react'

const Drawer = () => {
  return (
    <div className='mdl-layout__drawer'>
      <span className='mdl-layout-title'>Title</span>
      <nav className='mdl-navigation'>
        <a className='mdl-navigation__link' href=''>Link</a>
        <a className='mdl-navigation__link' href=''>Link</a>
        <a className='mdl-navigation__link' href=''>Link</a>
        <a className='mdl-navigation__link' href=''>Link</a>
      </nav>
    </div>
  )
}

export default Drawer