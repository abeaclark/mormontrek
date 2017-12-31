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
    zIndex: 10,
  },
  inner: {
    ...applicationStyles.mainTextContainer,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
}


const Modal = ({ children, isOpen=false, onClose, closeText="EXIT", buttonBottom=false}) =>
  <div css={{...styles.outer, backgroundColor: 'white', display: isOpen ? 'normal' : 'none'}}>
    <div css={{...styles.inner}}>
     {!buttonBottom &&
        <Button
          href="#"
          onClick={onClose}
        >
          {closeText}
        </Button>
      }
     {children}
     {buttonBottom &&
        <Button
          href="#"
          onClick={onClose}
        >
          {closeText}
        </Button>
      }
    </div>
  </div>

export default Modal
