import React from 'react'
import Helmet from 'react-helmet'

const defaultDescription = "OnCallogy takes care of credentialing, calendaring, and insurance. You'll be surprised at how soon you can start moonlighting on your schedule, hassle-free."
const defaultTitle = "OnCallogy | Moonlighting Simplified"
const defaultImage = ''
const defaultKeywords = 'moonlight, moonlighting, doctor, doctors, call, cover, side hustle, physician'

const mainScript={
  "type": "application/ld+json",
  "innerHTML": `{
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": "OnCallogy",
    "url": "https://www.oncallogy.com",
    "sameAs": [
      "https://www.facebook.com/OnCallogyApp/",
      "https://www.linkedin.com/company/oncallogy/",
      "https://twitter.com/oncallogy",
    ]
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
