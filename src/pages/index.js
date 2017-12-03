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
    bottom: '40px',
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

const options = {units: 'miles'}

const mainCoordinates = [
  {lat: 53.402777, lng: -2.9982981},
  {lat: 24.311048, lng: -80.3188557},
  {lat: 30.158514, lng: -89.6543447},
]

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
    }
    this.drawRoute = this.drawRoute.bind(this)
  }

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ user })
      const activities = []
      db.ref(`users/${user.uid}`).on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            gender: snapshot.val().gender,
          })
        }
      })
      db.ref(`activities/${user.uid}`).orderByChild("date").on('value', snapshot => {
        let mileageDone = 0
        if (snapshot.val()) {
          snapshot.forEach(childSnapshot => {
            const val = childSnapshot.val()
            mileageDone += val.miles
            activities.push(val) 
          })
        }
        this.setState({
          activities,
          mileageDone,
        })
      })
    })
  }

  placeBoat(map, maps) {
    const currentDistance = this.state.mileageDone
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
    if (!this.state.user) {
      return <div>Loading</div>
    }
    console.log(this.state.user)

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
            style={{ position: 'absolute', bottom: '40px', left: '20px' }}
            gender={this.state.gender}
            emoji=":smile:"
          />
          <div css={styles.addButton} onClick={() => navigateTo('/activity')}>
            <MdAdd size={30} color="white"/>
          </div>
          <div css={styles.settingsButton} onClick={() => navigateTo('/profile')}>
            <MdSettings size={40} color={colors.green}/>
          </div>
          <div css={{zIndex: 10, position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green}}>
            You have sailed {Math.round(this.state.mileageDone)} of {Math.round(this.state.lineLength)} miles ({Math.round(this.state.mileageDone/this.state.lineLength * 100)}%)
          </div>
        </Hero>
        <ActivityLog activities={this.state.activities}/>
      </div>
    )
  }
}

export default IndexPage