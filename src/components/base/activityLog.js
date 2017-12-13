import React from 'react'
import { colors } from 'themes'
import { FaMinusCircle, } from 'react-icons/lib/fa';

const styles = {
  outer: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    margin: '20px',
    alignItems: 'center',
    margin: '0 auto',
    marginTop: '40px',
  },
  item: {
    padding: '10px',
    width: '100%',
    maxWidth: '400px',
    border: `1px solid ${colors.lightGrey}`,
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaceBetween',
    backgroundColor: 'white',
    color: 'grey',
    alignItems: 'center',
    textAlign: 'left',
  }
}

        // <FaMinusCircle size={20} style={{ color: 'red', marginRight: '20px', cursor: 'pointer'}}/>

export const Activity = ({ id, description, onlyOnce, title, miles, date, showDescription=true }) => (
  <div css={styles.item}>
    <div css={{ display: 'flex', flexDirection: 'column', borderRadius: '100%', width: 50, height: 50, color: 'white', backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center'}}>
      +{miles}
      <div css={{fontSize: '10px'}}>miles</div>
    </div>
    <div css={{marginLeft: '20px', width: '80%'}}>
      <div css={{ fontSize: '20px', color: 'black'}}>{title}</div>
      {showDescription &&
        <div css={{ fontSize: '15px'}}>{description}</div>
      }
      {date &&
        <div css={{ color: colors.lightGrey }} >{new Date(date).toLocaleDateString()}</div>
      }
    </div>
  </div>
)

const ActivityLog = ({ activities }) => {
  const ordered = activities.sort((a, b) => b.date - a.date)
  const activityElements = ordered.map(activity => <Activity {...activity} showDescription={false} />)
  return (
    <div css={{...styles.outer}}>
       {activityElements}
    </div>
  )
}
  

export default ActivityLog
