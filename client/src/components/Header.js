import React from 'react'

const Header = () => {
  return (
    <header className='mdl-layout__header mdl-color--green-500'>
      <div className='mdl-layout__header-row'>
        <span className='mdl-layout-title'>UVT-O Admin Panel</span>
        <div className='mdl-layout-spacer' />
        <nav className='mdl-navigation mdl-layout--large-screen-only'>
          <a className='mdl-navigation__link' href=''>Salir</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
