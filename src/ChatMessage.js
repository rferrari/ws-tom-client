import React from 'react'

export default ({ name, message }) =>
  <p>
    <strong>{name}</strong>: {message.split('\n').map((line, index) => (
      <React.Fragment key={index}>{line}<br /></React.Fragment>
    ))}
  </p>