import React from 'react'
import PropTypes from 'prop-types'
import Link from '../components/base/link'
import Helmet from 'react-helmet'
import css from './main.css'
import normalize from './normalize.css'
import MainHelmet from 'components/base/mainHelmet'
import { firebaseAuth } from 'config/firebase'
import { navigateTo } from "gatsby-link"

class Wrapper extends React.Component {
  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log('logged in!')
      } else {
        // User is signed out.
        // Redirect to login page
        console.log('logged out!')
        navigateTo('/login')
      }
    }, error => {
      console.log(error)
    })
  }
  render() {
    return (
      <div css={{ display: 'flex', minHeight: '100vh', flex: 1, flexDirection: 'column'}}>
        <MainHelmet />
        <div css={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {this.props.children()}
        </div>
      </div>
    )  
  }
}

export default Wrapper
