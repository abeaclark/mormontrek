import React from 'react'
import Helmet from 'react-helmet'
import Cover from 'media/trekCoverPhoto.png'

const defaultDescription = "Joy in the Journey, Peace in Me. Murray Little Cottonwood Stake Youth Pioneer Trek, 2018"
const defaultTitle = "Murray Little Conttonwood Stake | Youth Pioneer Trek"
const defaultImage = Cover
const defaultKeywords = 'Trek, Murray Little Cottonwood Stake, Youth, Pioneer'

const mainScript={
  "type": "application/ld+json",
  "innerHTML": `{
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": "Murray Little Cottonwood Stake Youth Pioneer Trek",
    "url": "https://trek.netlify.com",
  }`
}

export default ({ description=defaultDescription, title=defaultTitle, image=defaultImage, keywords=defaultKeywords, script }) => (
  <Helmet
    title={title}
    meta={[
      { property: 'description', content: description },
      { property: 'keywords', content:  keywords },
      { property: 'image', content: image },
    ]}
    script={[Object.assign(mainScript, script)]}
  >
    <meta property="og:description" content={description} />
    <meta property="twitter:description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={image} />
    <meta property="og:image" content={image} />
    <meta
      property="twitter:image"
      content={image}
    />
  </Helmet>
)
