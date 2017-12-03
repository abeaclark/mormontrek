import React from 'react'
import { colors } from 'themes'
import { FaMinusCircle, } from 'react-icons/lib/fa';

const styles = {
  outer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    margin: '20px',
    alignItems: 'center',
    margin: '0 auto',
    marginTop: '40px',
  },
  item: {
    padding: '20px',
    width: '100%',
    maxWidth: '400px',
    border: `1px solid ${colors.lightGrey}`,
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaceBetween',
    alignSelf: 'stretch',
  }
}

        // <FaMinusCircle size={20} style={{ color: 'red', marginRight: '20px', cursor: 'pointer'}}/>


const ActivityLog = ({ activities }) => {
  const ordered = activities.sort((a, b) => b.date - a.date)
  const activityElements = ordered.map(activity => {
    return (
      <div css={styles.item}>
        <div css={{ borderRadius: '100%', width: 40, height: 40, color: 'white', backgroundColor: colors.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          +{activity.miles}
        </div>
        <div css={{marginLeft: '20px'}}>
          <div css={{ fontSize: '20px'}}>{activity.display}</div>
          <div css={{ color: colors.lightGrey }} >{new Date(activity.date).toLocaleDateString()}</div>
        </div>
        
      </div>
    )
  })
  return (
    <div css={{...styles.outer}}>
       {activityElements}
    </div>
  )
}
  

export default ActivityLog
