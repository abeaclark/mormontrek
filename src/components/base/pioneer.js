import React from 'react'
import PioneerBoy from 'media/boypioneer.png'
import PioneerGirl from 'media/pioneergirl.png'
import Emoji from 'react-emoji-render'

import Cry from 'media/cry.png'
import Weary from 'media/weary.png'
import Anguished from 'media/anguished.png'
import Confused from 'media/confused.png'
import NeutralFace from 'media/neutral_face.png'
import Smile from 'media/smile.png'


const emojiOptions = [
  Cry,
  Weary,
  Anguished,
  Confused,
  NeutralFace,
  NeutralFace,
  Smile,
  Smile,
]

const styles = {
}

const Pioneer = ({ gender, scripturesReadCount=0, style={} }) => {
  let count = scripturesReadCount
  if (count < 0) { count = 0}
  if (count > 7) { count = 7}

  const emoji = emojiOptions[count]
  return (
    <div css={{ ...style, display: 'flex', flexDirection: 'row', fontSize: '10px' }}>
      <div css={{ display: 'flex', flexDirection: 'column' }}>
        <img src={emoji} style={{ width: '80px', height: '80px', marginBottom: '-20px', marginLeft: '5px', zIndex: 3 }}/>
        <img src={gender === 'male' ? PioneerBoy : PioneerGirl} css={{ height: '150px' }}/>
      </div>
      <div css={{ width: 200, height: 75, position: 'relative', borderRadius: '50%', zIndex: 3, backgroundColor: 'grey', color: 'white', padding: '20px'}}>
        <div css={{borderTopRightRadius: '100%', position: 'absolute', left: 10, bottom: 10, backgroundColor: 'grey', width: 25, height: 15}}>
        </div>
        Pioneers are happiest when they read their scriptures daily.
        <br/>
        You have read your scriptures {scripturesReadCount} of the last 7 days

      </div>
    </div>
  )
}
  

export default Pioneer
