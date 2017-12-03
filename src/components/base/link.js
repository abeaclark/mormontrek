import React from 'react'
import Link from 'gatsby-link'
import { fonts, colors } from '../../themes'

const styles = {
  link: {
  	color: colors.white,
  	textDecoration: 'none',
  	':hover': {
  		color: colors.mainBlue,
      textDecoration: 'none',
  	},
    ':active': {
      color: colors.mainBlue,
      textDecoration: 'none',
    },
    ':focus': {
      color: colors.mainBlue,
      textDecoration: 'none',
    },
  },
}

const StyledLink = ({ css, children, ...props }) =>
	<Link {...props} css={[styles.link, css]}>
		{children}
	</Link>
export default StyledLink


