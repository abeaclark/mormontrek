import { fontFamilies } from './fonts'

export default {
  mainTextContainer: {
    // ...fontFamilies.comfortaa,
    maxWidth: 800,
    padding: 10,
    // TODO: sort this out. 90% is a hack
    width: '90%',
    margin: '0 auto',
    alignSelf: 'stretch',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}