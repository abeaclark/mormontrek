import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import { FaMale, FaFemale } from 'react-icons/lib/fa';
import Button from 'components/base/button'
import { db, firebaseAuth } from 'config/firebase'
import Loading from 'components/base/loading'

const styles = {
  outer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
    color: 'white',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center'
  }
}

class Profile extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      firstName: '',
      lastName: '',
      gender: null,
      isAdmin: false,
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  logout() {
    firebaseAuth().signOut().then(function() {
      document.href = '/login'
    }, function(error) {
      console.log(error)
    });
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
      console.log(user)
      db.ref(`users/${user.uid}`).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.setState({
            user: user,
            firstName: snapshot.val().firstName,
            lastName: snapshot.val().lastName,
            gender: snapshot.val().gender,
            isAdmin: snapshot.val().isAdmin,
          })
        }
      })
    })
  }

  onSubmit() {
    const user = this.state.user
    db.ref(`users/${user.uid}`).set({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      gender: this.state.gender,
      isAdmin: this.state.isAdmin,
      phoneNumber: this.state.user.phoneNumber,
    })
    navigateTo('/')
  }

  render() {
    if (!this.state.user) {
      return <Loading />
    }

    const formIsValid = this.state.firstName && this.state.lastName && this.state.gender
    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
        <Hero backgroundColor={colors.darkBlue} >
          <div css={styles.outer}>
            <div css={styles.inner}>
              <div css={styles.inputGroup}>
                <p>First Name</p>
                <input
                  css={styles.input}
                  value={this.state.firstName}
                  onChange={e => this.setState({ firstName: e.target.value })}
                />
              </div>
              <div css={styles.inputGroup}>
                <p>Last Name</p>
                <input
                  css={styles.input}
                  value={this.state.lastName}
                  onChange={e => this.setState({ lastName: e.target.value })}
                />
              </div>
              <div css={styles.inputGroup}>
                <p>Gender</p>
                <div>
                  <FaFemale
                    onClick={() => this.setState({ gender: 'female'})}
                    color={this.state.gender === 'female' ? colors.green : colors.grey}
                    size={40}
                    style={{ cursor: 'pointer', marginRight: '10px'}}
                  />
                  <FaMale
                    onClick={() => this.setState({ gender: 'male'})}
                    color={this.state.gender === 'male' ? colors.green : colors.grey}
                    size={40}
                    style={{ cursor: 'pointer', marginLeft: '10px'}}
                  />
                </div>
              </div>
              <Button
                disabled={!formIsValid}
                style={{marginTop: '20px'}}
                onClick={this.onSubmit}
              >
                Submit
              </Button>
              {this.state.isAdmin &&
                <Link to="/admin" style={{marginTop: '20px'}} >
                  View Admin Panel
                </Link>
              }
              <div css={{marginTop: 20, cursor: 'pointer'}} onClick={this.logout}>
                Logout
              </div>
            </div>
          </div>
        </Hero>
      </div>
    )
  }
}

export default Profile