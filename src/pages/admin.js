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

class Admin extends React.Component {
  constructor() {
    super()
    this.state = {
      currentView: 'users',
      options: null,
      users: null,
    }
    this.showView = this.showView.bind(this)
    this.addActivity = this.addActivity.bind(this)
    this.updateActivity = this.updateActivity.bind(this)
    this.deleteActivity = this.deleteActivity.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
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
          this.setState({
            users: snapshot.val()
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

  render() {
    if (!this.state.isAdmin) {
      return <Loading />
    }
    const usersData = []
    const users = this.state.users || {}
    Object.keys(users).forEach(function(key) {
        usersData.push({...users[key], id: key})
    });
    const activitiesData = []
    const options = this.state.options || {}
    Object.keys(options).forEach(function(key) {
        activitiesData.push({...options[key], id: key})
    });
    activitiesData.reverse()

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
              style={{ backgroundColor: this.state.currentView === 'activities' ? colors.mainBlue : colors.grey }}
              onClick={() => this.showView('activities')}
            >
              Activities
            </Button>
          </div>
          {this.state.currentView === 'users' &&
            <Users usersData={usersData}/>
          }
          {this.state.currentView === 'activities' &&
            <div>
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
        </div>
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
        <span>Miles</span>
        <input
          type="number"
          value={this.state.miles}
          onChange={e => this.setState({ miles: e.target.value })}
          css={styles.input}/>
        <input
          type="checkbox"
          checked={this.state.onlyOnce}
          css={{marginRight: '10px'}}
          onChange={e => this.setState({ onlyOnce: !this.state.onlyOnce })}
        />
        <span>Once Only?</span>
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

const Activities = ({ activitiesData, deleteActivity, updateActivity }) => (
  <div>
    {activitiesData.map(activity => (
      <Activity 
        {...activity}
        deleteActivity={deleteActivity}
        updateActivity={updateActivity}
        key={activity.id}
      />
    ))}
  </div>
)

const Users = ({ usersData }) => (
  <ReactTable
    data={usersData}
    columns={[
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName"
          },
          {
            Header: "Last Name",
            accessor: "lastName"
          }
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
    ]}
    defaultPageSize={10}
    className="-striped -highlight"
  />
)

export default Admin