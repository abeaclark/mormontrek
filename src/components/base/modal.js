import React from 'react'
import { applicationStyles } from 'themes'
import Button from 'components/base/button'

const styles = {
  outer: {
    minHeight: '100vh',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  inner: {
    ...applicationStyles.mainTextContainer,
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    minHeight: '100vh',
    width: '100vw',
  },
}


const Modal = ({ children, isOpen=false, onClose}) =>
  <div css={{...styles.outer, backgroundColor: 'white', display: isOpen ? 'normal' : 'none', justifyContent: 'flex-start'}}>
    <div
      css={{textAlign: 'center', padding: 30, width: '100%' }}
    >
      <Button
        href="#"
        onClick={onClose}
      >
        EXIT
      </Button>
    </div>
    <div css={{...styles.inner}}>
     {children}
    </div>
  </div>

export default Modal
