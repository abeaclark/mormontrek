import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import { FaMale, FaFemale } from 'react-icons/lib/fa'
import Button from 'components/base/button'
import { db, firebaseAuth } from 'config/firebase'

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

class Activity extends React.Component {
  constructor() {
    super()
    this.state = {
      options: null,
      date: new Date(),
      user: null,
      variable: null,
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
    })
    db.ref(`options`).once('value')
    .then(snapshot => {
      if (snapshot.val()) {
        this.setState({
          options: snapshot.val(),
          variable: snapshot.val()[0].variable
        })
      }
    })
  }

  onSubmit() {
    const user = this.state.user
    const selectedOption = this.state.options.find(el => el.variable === this.state.variable)
    db.ref(`activities/${user.uid}`).push({
      variable: this.state.variable,
      miles: selectedOption.miles,
      display: selectedOption.display,
      date: this.state.date.getTime(),
    })
    navigateTo('/')
  }

  render() {
    if (!this.state.options) {
      return <div>Loading</div>
    }
    console.log(this.state)
    const optionElements = this.state.options.map(option =>
      <option value={option.variable}>{option.display}</option>
    )
    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
        <Hero backgroundColor={colors.darkBlue} >
          <div css={styles.outer}>
            <div css={styles.inner}>
              <div css={styles.inputGroup}>
                <p>Activity Type</p>
                <select
                  css={styles.input}
                  value={this.state.variable}
                  onChange={e => this.setState({ 
                    variable: e.target.value,
                  })}
                  autoFocus
                >
                  {optionElements}
                </select>
              </div>
              <div css={styles.inputGroup}>
                <p>Date</p>
                <input
                  css={styles.input}
                  type="date"
                  onChange={(e) => this.setState({ date: new Date(e.target.value)})}
                  value={this.state.date.toISOString().substring(0, 10)}
                />
              </div>
              <Button
                style={{marginTop: '20px'}}
                onClick={this.onSubmit}
              >
                Add Activity
              </Button>
            </div>
          </div>
        </Hero>
      </div>
    )
  }
}

export default Activity