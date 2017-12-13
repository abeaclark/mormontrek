import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import { FaMale, FaFemale } from 'react-icons/lib/fa'
import Button from 'components/base/button'
import { db, firebaseAuth } from 'config/firebase'
import { Activity } from 'components/base/activityLog'

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
    alignSelf: 'stretch',
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

class Activities extends React.Component {
  constructor() {
    super()
    this.state = {
      options: null,
      date: new Date(),
      user: null,
      variable: null,
      activities: {},
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
      db.ref(`activities/${user.uid}`).on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            activities: snapshot.val(),
          })
        }
      })
    })
    db.ref(`options`).once('value')
    .then(snapshot => {
      if (snapshot.val()) {
        this.setState({
          options: snapshot.val(),
        })
      }
    })

  }

  onSubmit(activity) {
    const user = this.state.user
    db.ref(`activities/${user.uid}`).push({
      ...activity,
      date: this.state.date.getTime(),
    })
    navigateTo('/')
  }

  render() {
    const activitiesData = []
    const options = this.state.options || {}
    const doneActivities = this.state.activities || {}
    Object.keys(options).forEach(key => {
      if (options[key].onlyOnce) {
        // if it is an onlyOnce activity, we want to be sure it's not already done
        let alreadyDone = false
        Object.keys(doneActivities).forEach(key1 => {
          console.log(doneActivities[key1])
          if (doneActivities[key1].id === key) {
            alreadyDone = true
          }
        })
        if (!alreadyDone) {
          activitiesData.push({...options[key], id: key})
        }
      } else {
        activitiesData.push({...options[key], id: key})
      }
    })

    const activityElements = activitiesData.map(activity =>
      <div css={{cursor: 'pointer', width: '100%', maxWidth: '400px'}} onClick={() => this.onSubmit(activity)}>
        <Activity {...activity} />
      </div>
    )
    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
        <Hero backgroundColor={colors.darkBlue} >
          <div css={styles.outer}>
            <div css={styles.inner}>
              <div css={styles.inputGroup}>
                <p>Choose the Date of the Activity</p>
                <input
                  css={styles.input}
                  type="date"
                  onChange={(e) => this.setState({ date: new Date(e.target.value)})}
                  value={this.state.date.toISOString().substring(0, 10)}
                />
              </div>
              <p>Choose the Activity</p>
              {activityElements}
            </div>
          </div>
        </Hero>
      </div>
    )
  }
}

export default Activities