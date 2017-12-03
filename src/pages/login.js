import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import firebaseAuth from 'config/firebase'
import firebase from 'firebase'
import { FirebaseAuth as FirebaseUI } from 'react-firebaseui';

const styles = {
}

class IndexPage extends React.Component {
  render() {
    var uiConfig = {
      signInSuccessUrl: '/profile',
      signInOptions: [
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: '/'
    };
    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
        <Hero backgroundColor={colors.darkBlue} >
          <FirebaseUI uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </Hero>
      </div>
    )
  }
}

export default IndexPage