import React from 'react'
import { applicationStyles } from 'themes'
import { colors } from 'themes'

const styles = {
  outer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90vh',
  },
}


const Loading = ({ style={} }) =>
  <div css={{...styles.outer, ...style }}>
     Loading...
  </div>

export default Loading


