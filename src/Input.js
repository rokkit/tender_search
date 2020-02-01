import React, { useState, useRef } from 'react'
import _ from 'lodash'

const Input = (props) => {
  const [query, setQuery] = useState("");
  const onChange = (val) => {
    setQuery(val)
    delayedQuery(val);
  }

  const delayedQuery = useRef(_.debounce(val => props.onQueryChange(val), 500)).current;

  return (
    <input type="text" value={query} onChange={e => onChange(e.target.value)} className="NewOrder_newClaimInput__1Az5h NewOrder_active__1Tlml" placeholder="Поиск..." />
  )
}

export default Input