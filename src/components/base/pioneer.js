import React from 'react'
import PioneerBoy from 'media/boypioneer.png'
import PioneerGirl from 'media/pioneergirl.png'
import Emoji from 'react-emoji-render';


// :smile:
// :anguished:
// :confused:
// :neutral_face:
// :weary:
// :cry:
const styles = {
}

const Pioneer = ({ gender, emoji, style={} }) =>
  <div css={{ ...style, display: 'flex', flexDirection: 'column' }}>
    <Emoji style={{ fontSize: '80px', marginBottom: '-20px', zIndex: 3 }} text={emoji} />
    <img src={gender === 'male' ? PioneerBoy : PioneerGirl} css={{ height: '150px' }}/>
  </div>

export default Pioneer
