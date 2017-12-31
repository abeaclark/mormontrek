import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import { FaMale, FaFemale } from 'react-icons/lib/fa';
import Button from 'components/base/button'
import { db, firebaseAuth } from 'config/firebase'
import ReactTable from "react-table";
import "react-table/react-table.css";
import Loading from 'components/base/loading'
import Modal from 'components/base/modal'
import ActivityLog from 'components/base/activityLog'

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
  input: {
    width: '100%',
    marginBottom: '5px',
    border: '1px solid grey',
  },
}

const sumActivities = (activities={}) => {
  let mileageDone = 0
  let totalActivitiesDone = 0
  let scripturesReadCountLastWeek = 0
  let mileageDoneLastWeek = 0
  let oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  oneWeekAgo = oneWeekAgo.getTime()

  const activitiesArray = Object.keys(activities).map(function(key) {
    return activities[key];
  });

  activitiesArray.forEach(activity => {
    const miles = parseFloat(activity.miles)
    totalActivitiesDone += 1
    mileageDone += miles
    if(activity.date > oneWeekAgo) {
      if (/scripture/gi.test(activity.title)) {
        scripturesReadCountLastWeek += 1
      }
      mileageDoneLastWeek += miles
    }
  })
  return {
    mileageDone,
    mileageDoneLastWeek,
    totalActivitiesDone,
    scripturesReadCountLastWeek,
  }
}

const getActivityDetails = (id, allActivities) => {
  const activities = allActivities[id]
  return sumActivities(activities)
}

class Admin extends React.Component {
  constructor() {
    super()
    this.state = {
      currentView: 'activities',
      options: null,
      users: null,
      allActivities: {},
      modalId: null,
    }
    this.showView = this.showView.bind(this)
    this.addActivity = this.addActivity.bind(this)
    this.updateActivity = this.updateActivity.bind(this)
    this.deleteActivity = this.deleteActivity.bind(this)
    this.addUpdate = this.addUpdate.bind(this)
    this.updateUpdate = this.updateUpdate.bind(this)
    this.deleteUpdate = this.deleteUpdate.bind(this)
    this.onUserClick = this.onUserClick.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
      const allActivities = {}
      db.ref(`users/${user.uid}`).on('value', snapshot => {
        if (snapshot.val()) {
          if (snapshot.val().isAdmin) {
            this.setState({
              isAdmin: true
            })  
          } else {
            // they aren't admin, get them back to safety!
            document.location.href="/"  
          }
        }
      })

      db.ref('users').once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          const users = snapshot.val()

          Object.keys(users).forEach(key => {
            console.log('wow')
            db.ref(`activities/${key}`).once('value')
            .then(snapshot => {
              if (snapshot.val()) {
                allActivities[key] = snapshot.val()
              }
            })
          })

          this.setState({
            users,
            allActivities,
          })
        }
      })

      db.ref('options').on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            options: snapshot.val()
          })
        }
      })

      db.ref('updates').on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            updates: snapshot.val()
          })
        }
      })
    })
  }

  showView(view) {
    this.setState({ currentView: view})
  }

  addActivity(data) {
    const { title, description, miles, onlyOnce } = data
    db.ref(`options`).push({
      title,
      description,
      miles,
      onlyOnce,
    })
  }

  updateActivity(id, data) {
    db.ref(`options`).child(id).set(data)
  }

  deleteActivity(id) {
    db.ref(`options`).child(id).remove()
  }

  addUpdate(data) {
    const { title, description, miles } = data
    db.ref(`updates`).push({
      title,
      description,
      miles,
    })
  }

  updateUpdate(id, data) {
    delete data.onlyOnce
    db.ref(`updates`).child(id).set(data)
  }

  deleteUpdate(id) {
    db.ref(`updates`).child(id).remove()
  }

  onUserClick(id) {
    this.setState({ modalId: id })
  }

  closeModal(id) {
    this.setState({ modalId: null })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Loading />
    }
    const usersData = []
    const users = this.state.users || {}
    const allActivities = this.state.allActivities || {}
    const modalId = this.state.modalId
    let modalActivities = []
    Object.keys(users).forEach(function(key) {
      const activityDetails = getActivityDetails(key, allActivities)
      usersData.push({...users[key], id: key, activityDetails})
      if (modalId === key) {
        modalActivities = Object.keys(allActivities[key]).map(function(key1) {
          return allActivities[key][key1]
        });
      }
    });
    const activitiesData = []
    const options = this.state.options || {}
    Object.keys(options).forEach(function(key) {
      activitiesData.push({...options[key], id: key})
    });
    activitiesData.reverse()

    const updatesData = []
    const updates = this.state.updates || {}
    Object.keys(updates).forEach(function(key) {
      updatesData.push({...updates[key], id: key})
    });
    console.log(updatesData)
    updatesData.reverse()

    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column', maxWidth: '500px', margin: '0 auto', alignItems: 'center'}}>
        <h1>Admin</h1>
        <div css={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <div css={{marginBottom: '30px',}}>
            <Button
              style={{ marginRight: '20px', backgroundColor: this.state.currentView === 'users' ? colors.mainBlue : colors.grey }}
              onClick={() => this.showView('users')}
            >
              Users
            </Button>
            <Button
              style={{ marginRight: '20px', backgroundColor: this.state.currentView === 'activities' ? colors.mainBlue : colors.grey }}
              onClick={() => this.showView('activities')}
            >
              Activities
            </Button>
            <Button
              style={{ backgroundColor: this.state.currentView === 'updates' ? colors.mainBlue : colors.grey }}
              onClick={() => this.showView('updates')}
            >
              Updates
            </Button>
          </div>
          {this.state.currentView === 'users' &&
            <Users usersData={usersData} onClick={this.onUserClick}/>
          }
          {this.state.currentView === 'activities' &&
            <div>
              <p>
                Activites are the options that users can select to earn miles. The "Once Only" checkbox
                notates activities that will no longer be an option after the user has done it once (For example, they can only attend the kickoff fireside once).
              </p>
              <p>
                Any changes here will be available to all users effective immediately.
              </p>
              <h1>Add Activity</h1>
              <Activity addActivity={this.addActivity} />  
            </div>
          }
          {this.state.currentView === 'activities' &&
            <div>
              <h1>Existing Activities</h1>
              <Activities
                deleteActivity={this.deleteActivity}
                updateActivity={this.updateActivity}
                activitiesData={activitiesData}
              />
            </div>
          }
          {this.state.currentView === 'updates' &&
            <div>
              <p>
                Updates are messages that you want to be displayed to users when they hit certain mile markers.
              </p>
              <p>
                If you enter a number in the miles field, the update will be displayed when the user hits that mileage.
                If you select 0 for mileage, then the user will see the message the next time they log in.
              </p>
              <h1>Add Update</h1>
              <Activity addActivity={this.addUpdate} isUpdate/>  
            </div>
          }
          {this.state.currentView === 'updates' &&
            <div>
              <h1>Current Updates</h1>
              <Activities
                deleteActivity={this.deleteUpdate}
                updateActivity={this.updateUpdate}
                activitiesData={updatesData}
                isUpdate
              />
            </div>
          }
        </div>
        <Modal
          isOpen={this.state.modalId}
          onClose={this.closeModal}
        >
          <ActivityLog activities={modalActivities}/>
        </Modal>
      </div>
    )
  }
}

class Activity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      description: this.props.description,
      miles: this.props.miles,
      onlyOnce: this.props.onlyOnce,
    }
    this.addActivity = this.addActivity.bind(this)
  }

  addActivity() {
    this.props.addActivity(this.state)
    this.setState({ title: '', description: '', miles: 0, onlyOnce: false})
  }

  render(){
    const isCurrent = (
      this.state.title === this.props.title &&
      this.state.description === this.props.description &&
      this.state.miles === this.props.miles &&
      this.state.onlyOnce === this.props.onlyOnce
    )
    return (
      <div css={{ border: '1px solid grey', padding: '20px', marginBottom: '20px'}}>
        <span>Title</span>
        <input
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          css={styles.input}
        />
        <span>Description</span>
        <textarea
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
          css={styles.input}
        />
        <span>{this.props.isUpdate ? 'Show update when user reaches this mileage' : 'Miles User earns for completion'}</span>
        <input
          type="number"
          value={this.state.miles}
          onChange={e => this.setState({ miles: e.target.value })}
          css={styles.input}/>
        {!this.props.isUpdate &&
          <div>
            <input
              type="checkbox"
              checked={this.state.onlyOnce}
              css={{marginRight: '10px'}}
              onChange={e => this.setState({ onlyOnce: !this.state.onlyOnce })}
            />
            <span>Once Only?</span>
          </div>
        }
        <span css={{ display: 'flex', alignSelf: 'stretch', justifyContent: 'flex-end'}}>
          { this.props.addActivity &&
            <Button
              style={{ backgroundColor: 'green'}}
              onClick={this.addActivity}
            >
              Add
            </Button>
          }
          { !this.props.addActivity &&
            <div>
              <Button
                disabled={isCurrent}
                style={{ backgroundColor: isCurrent ? 'grey' : 'green'}}
                onClick={() => this.props.updateActivity(this.props.id, this.state)}
              >
                Update
              </Button>
              <Button
                style={{ backgroundColor: 'red'}}
                onClick={() => this.props.deleteActivity(this.props.id)}
              >
                Delete
              </Button>
            </div>
          }
        </span>
      </div>
    )
}
}

const Activities = ({ activitiesData, deleteActivity, updateActivity, isUpdate=null }) => (
  <div>
    {activitiesData.map(activity => (
      <Activity 
        {...activity}
        deleteActivity={deleteActivity}
        updateActivity={updateActivity}
        key={activity.id}
        isUpdate={isUpdate}
      />
    ))}
  </div>
)

const Users = ({ usersData, onClick }) => {
  return (
    <ReactTable
      data={usersData}
      columns={[
        {
          Header: "Name",
          columns: [
            {
              Header: "Name",
              id: "name",
              accessor: d => <a href="#" onClick={() => onClick(d.id)} >{`${d.firstName} ${d.lastName}`}</a>,
            },
          ]
        },
        {
          Header: "Info",
          columns: [
            {
              Header: "Gender",
              accessor: "gender"
            },
            {
              Header: "Phone Number",
              accessor: "phoneNumber"
            },
            {
              Header: "Admin",
              id: 'isAdmin',
              accessor: d => d.isAdmin ? 'true' : 'false',
            },
          ]
        },
        {
          Header: "Stats",
          columns: [
            {
              Header: "Total Miles",
              id: "totalMiles",
              accessor: d => d.activityDetails.mileageDone,
            },
            {
              Header: "Last 7 Days",
              id: "last7Days",
              accessor: d => d.activityDetails.mileageDoneLastWeek,
            },
            {
              Header: "Total Activity Count",
              id: "totalActivityCount",
              accessor: d => d.activityDetails.totalActivitiesDone,
            },
            {
              Header: "Last 7 Days: Scriptures",
              id: "scriptureCountLast7Days",
              accessor: d => d.activityDetails.scripturesReadCountLastWeek,
            },
          ]
        },
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  )
}

export default Admin