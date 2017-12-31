import React from 'react'
import { applicationStyles } from 'themes'

const styles = {
  inner: {
    ...applicationStyles.mainTextContainer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  }
}


const Update = ({ title, description }) =>
  <div css={{...styles.inner }}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>

export default Update
