import React from 'react'
import Link from '../components/base/link'
import { fonts, colors, applicationStyles } from '../themes'
import { navigateTo } from "gatsby-link"
import Hero from 'components/base/hero'
import { MdAdd, MdClose, MdNoteAdd, MdSettings } from 'react-icons/lib/md';
import GoogleMapReact from 'google-map-react'
import Pioneer from 'components/base/pioneer'
import ActivityLog from 'components/base/activityLog'
import { lineString } from '@turf/turf'
import along from '@turf/along'
import turfLength from '@turf/length'
import boat from 'media/boat.png'
import { db, firebaseAuth } from 'config/firebase'
import Loading from 'components/base/loading'
import Modal from 'components/base/modal'
import Update from 'components/base/update'

const GOOGLE_MAPS_KEY = 'AIzaSyBkoQIfUFZ7jU9PVfC3nD0jmCZUwUz9rfk'

const styles = {
  addButton: {
    cursor: 'pointer',
    padding: '5px',
    borderRadius: "100%",
    backgroundColor: colors.green,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: '20px',
    bottom: '70px',
  },
  settingsButton: {
    cursor: 'pointer',
    padding: '5px',
    borderRadius: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '20px',
    top: '20px',
  }
}

const ASSUMED_LENGTH = 3600

const options = {units: 'miles'}

const mainCoordinates = [
  {lat: 53.402777, lng: -2.9982981},
  {lat: 24.311048, lng: -80.3188557},
  {lat: 30.158514, lng: -89.6543447},
]

function inArray(array, id) {
  for(var i=0;i<array.length;i++) {
    if (array[i] === id){
      return true
    }
  }
  return false;
}


// reformat to [[-83, 30], [-84, 36], [-78, 41]] for turf
const formatCoordinates = coordinates => coordinates.map(coordinate => {
  return [coordinate.lat, coordinate.lng]
})

class IndexPage extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      lineLength: null,
      line: null,
      activities: [],
      mileageDone: 0,
      updates: {},
      viewedUpdates: {},
    }
    this.drawRoute = this.drawRoute.bind(this)
    this.exitUpdate = this.exitUpdate.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      if (!user) {
        window.location = '/login'
        return
      }
      this.setState({ user })
      const activities = []
      db.ref(`users/${user.uid}`).on('value', snapshot => {
        if(!snapshot.exists()){
          // re-route them to profile if not complete
          window.location = '/profile'
        }
        if (snapshot.val()) {
          this.setState({
            gender: snapshot.val().gender,
          })
        }
      })
      db.ref(`activities/${user.uid}`).orderByChild("date").on('value', snapshot => {
        let mileageDone = 0
        let scripturesReadCount = 0
        let oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        oneWeekAgo = oneWeekAgo.getTime()
        if (snapshot.val()) {
          snapshot.forEach(childSnapshot => {
            const val = childSnapshot.val()
            mileageDone += parseFloat(val.miles)
            activities.push(val)
            if(val.date > oneWeekAgo && /scripture/gi.test(val.title)) {
              scripturesReadCount += 1
            }
          })
        }
        this.setState({
          activities,
          mileageDone,
          scripturesReadCount
        })
      })

      db.ref('updates').on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            updates: snapshot.val()
          })
        }
      })

      // read receipts of updates for a given user
      db.ref(`viewedUpdates/${user.uid}`).on('value', snapshot => {
        if(snapshot.exists()){
          this.setState({
            viewedUpdates: snapshot.val(),
          })
        }
      })
    })
  }

  exitUpdate(id) {
    db.ref(`viewedUpdates/${this.state.user.uid}`).push(id)
  }

  placeBoat(map, maps) {
    // coerce our assumed mileage into real mileage
    const currentDistance = this.state.mileageDone / ASSUMED_LENGTH * this.state.lineLength
    const position = along(this.state.line, currentDistance, options)
    const latLng = { lat: position.geometry.coordinates[0], lng: position.geometry.coordinates[1] }
    const marker = new maps.Marker({
      position: latLng,
      map: map,
      icon: boat,
    })
  }

  drawRoute(map, maps) {
    const main = new maps.Polyline({
      path: mainCoordinates,
      strokeColor: '#FFF',
      strokeOpacity: 0.3,
      strokeWeight: 20,
      geodesic: true,
    });
    main.setMap(map)

    const line = lineString(formatCoordinates(mainCoordinates))

    const length = turfLength(line, options)

    this.setState({
      lineLength: length,
      line,
    })

    this.placeBoat(map, maps)
  }

  static defaultProps = {
    center: {lat: 20, lng: -40},
    zoom: 2,
  };
  render() {
    if (!this.state.user || !this.state.gender) {
      return <Loading />
    }

    const createMapOptions = maps => {
      let zl = 2
      if (typeof window !== 'undefined') {        
        zl = Math.round(Math.log(window.innerWidth/512)) + 2
      }
      return {
        panControl: false,
        mapTypeControl: false,
        scrollwheel: false,
        disableDefaultUI: true,
        draggable: false,
        minZoom: zl,
        minZoomOverride: true,
        maptype: 'terrain',
        styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
      }
    }

    let unseenUpdate = null

    const viewedUpdates = Object.values(this.state.viewedUpdates)
    let updates = this.state.updates
    const updatesArray = []
    const mileageDone = this.state.mileageDone
    Object.keys(updates).forEach(function(key) {
      if (inArray(viewedUpdates, key)){
        // they have already seen it, don't include
      } else if (mileageDone > updates[key].miles){
        // They haven't seen it, show them!
        updatesArray.push({...updates[key], id: key})    
      }
    });
    // Lowest mileage message first
    updatesArray.sort((a, b) => a.miles - b.miles)
    return (
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column'}}>
        <Hero backgroundColor={colors.darkBlue} style={{width: '100%'}}>
          <GoogleMapReact
            onGoogleApiLoaded={({map, maps}) => this.drawRoute(map, maps)}
            yesIWantToUseGoogleMapApiInternals
            options={createMapOptions}
            style={{ width: '50px', height: '50px'}}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            bootstrapURLKeys={{
              key: GOOGLE_MAPS_KEY,
              language: 'en',
            }}
          >
          </GoogleMapReact>
          <Pioneer
            style={{ position: 'absolute', bottom: '60px', left: '20px' }}
            gender={this.state.gender}
            scripturesReadCount={this.state.scripturesReadCount}
          />
          <div css={styles.addButton} onClick={() => navigateTo('/activity')}>
            <MdAdd size={30} color="white"/>
          </div>
          <div css={styles.settingsButton} onClick={() => navigateTo('/profile')}>
            <MdSettings size={40} color={colors.green}/>
          </div>
          <div css={{paddingBottom: '20px', zIndex: 10, position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green}}>
            You have sailed {Math.round(this.state.mileageDone)} of {ASSUMED_LENGTH} miles ({Math.round(this.state.mileageDone/ASSUMED_LENGTH * 100)}%)
          </div>
        </Hero>
        <h1 css={{ textAlign: 'center'}}>My Activity Log</h1>
        {!this.state.activities || !this.state.activities.length &&
          <p css={{ textAlign: 'center'}}>Add an activity by pressing the plus icon!</p>
        }
        <ActivityLog activities={this.state.activities}/>
        <Modal
          isOpen={updatesArray.length && updatesArray[0]}
          onClose={() => this.exitUpdate(updatesArray[0].id)}
          closeText="Got it!"
          buttonBottom
        >
          <Update
            {...updatesArray[0]}
          />
        </Modal>
      </div>
    )
  }
}

export default IndexPage