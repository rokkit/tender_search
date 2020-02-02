import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const Chooser = (props) => {
  const [firstGroupVal, setFirstGroupVal] = useState('')
  const [secondGroupVal, setSecondGroupVal] = useState('')

  if(!props.firstGroup) return null

  const onFirstGroupValChange = (val) => {
    setFirstGroupVal(val)
    setSecondGroupVal('')
    props.onTClassChange('')
    props.onPClassChange(val)
  }

  const onSecondGroupValChange = (val) => {
    setSecondGroupVal(val)
    props.onTClassChange(val)
  }

  const styles = {
    color: '#999',
    minHeight: 30,
    paddingTop: 30,
    color: '#999',
    fontSize: 15,
    backgroundColor: '#fff',
    padding: '41px 47px',
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 3px 30px rgba(0,0,0,.1)',
    borderLeft: '2px solid #f1f1f1',
    borderRight: '2px solid #f1f1f1',
    borderBottom: '2px solid #f1f1f1',
    textAlign: 'center'
  }

  if(props.isLoading && props.items.length === 0) {
    return <p style={styles}>Подождите, выполняется поиск...</p>
  }

  if(props.items.length === 0) {
    return <p style={styles}>По вашему запросу позиций не найдено, уточните запрос</p>
  }

  // props.items.map((p) => {
  //   if(firstGroupVal != '' && firstGroupVal == p['Вид продукции']) {
  //     if(secondGroup.indexOf(p['Вид товаров']) == -1) {
  //       secondGroup.push(p['Вид товаров'])
  //     }
  //   }
  // })
  var secondGroup = []
  _.keys(props.secondGroup).map((tKey) => {
    if(firstGroupVal != '' && props.secondGroup[tKey] == firstGroupVal) secondGroup.push(tKey)
  })

  return (
    <div className={`NewOrder_dropdown__36dDM ${props.isActive ? "NewOrder_active__1Tlml" : ""}`}>
      <div className="NewOrder_subtitle__2jMQG">Группа товаров</div>
      <Group onChange={onFirstGroupValChange} items={props.firstGroup} />
      <div className="NewOrder_subtitle__2jMQG">Подгруппа товара</div>
      <Group onChange={onSecondGroupValChange} items={secondGroup} />
    </div>
  )
}

const Group = (props) => {
  const [firstGroupVal, setFirstGroupVal] = useState('');

  const firstGroupItems = props.items.map((item, i) => {
    return <li key={i} onClick={() => {
      setFirstGroupVal(item)
      props.onChange(item)
    }} className={`NewOrder_item__6cbjd ${firstGroupVal === item ? "NewOrder_active__1Tlml" : ''}`}>{item} </li>
  })

  return (
    <ul className="NewOrder_list__23D5U">
      {firstGroupItems}
    </ul>
  )
}

export default Chooser