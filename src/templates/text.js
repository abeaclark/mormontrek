import React from 'react'
import { applicationStyles } from 'themes'
import PageTitle from 'components/base/pageTitle'
import './avenir-white.css'

class TextTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <div>
        <PageTitle title={post.frontmatter.title} />
        <div className="blog-post" css={applicationStyles.mainTextContainer}>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </div>
    )
  }
}

export default TextTemplate

export const pageQuery = graphql`
  query TextByPath($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
      }
    }
  }
`