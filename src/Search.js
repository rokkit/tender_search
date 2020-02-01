import React, { useState, useEffect } from 'react'

import './Search.css'

import Input from './Input'
import Drop from './Drop'

import _ from 'lodash'

const Search = (props) => {
  const initialState = {
    isLoading: false,
    isChooserActive: false,
    firstGroup: [],
    secondGroup: [],
    productItems: []
  }
  const [state, setState] = useState(initialState)
  const onQueryChange = (val) => {
    if (val !== "") {
      setState(prevState => Object.assign({}, prevState, {
        isLoading: true
      }))
      fetchProducts(val).then((productItems) => {
        props.setProducts(productItems)
        setState(prevState => Object.assign({}, prevState, {
          isLoading: false,
          isChooserActive: true,
          productItems: productItems
        }))
      })
    } else {
      setState(prevState => initialState)
    }
  }

  const fetchProducts = async (val) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "text": val });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      mode: 'cors'
    };

    const response = await fetch("http://tenderfind.ru:7777/api/v1/themes/", requestOptions)
    const json = await response.json();
    return json['result']
  }

  const styles = {
    minWidth: 960
  }
  console.log('render')
  return (
    <div className="NewOrder_newClaim__3gVH9" style={styles}>
      <div className="NewOrder_newClaimAction__IicAX">
        <Input onQueryChange={onQueryChange} />
        {state.isChooserActive && <Chooser items={state.productItems} isActive={state.isChooserActive} />}
        {!state.isChooserActive && <Drop />}
        <Button isLoading={state.isLoading} />
      </div>
    </div>
  )
}

const Group = (props) => {
  const [firstGroupVal, setFirstGroupVal] = useState('');

  const firstGroupItems = props.items.map((item, i) => {
    return <li key={i} onClick={() => { setFirstGroupVal(item); props.onChange(item) }} className={`NewOrder_item__6cbjd ${firstGroupVal === item ? "NewOrder_active__1Tlml" : ''}`}>{item} </li>
  })

  return (
    <ul className="NewOrder_list__23D5U">
      {firstGroupItems}
    </ul>
  )
}

const Chooser = (props) => {

  const [firstGroupVal, setFirstGroupVal] = useState('')

  var firstGroup = []
  var secondGroup = []

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
  if(props.items.length === 0) {
    return <p style={styles}>По вашему запросу позиций не найдено, уточните запрос</p>
  }

  props.items.map((p) => {
    firstGroup.push(p['Вид продукции'])
    if(firstGroupVal != '' && firstGroupVal == p['Вид продукции']) {
      secondGroup.push(p['Вид товаров'])
    }
  })

  firstGroup = _.uniq(firstGroup)
  secondGroup = _.uniq(secondGroup)

  return (
    <div className={`NewOrder_dropdown__36dDM ${props.isActive ? "NewOrder_active__1Tlml" : ""}`}>
      <div className="NewOrder_subtitle__2jMQG">Группа товаров</div>
      <Group onChange={(val) => setFirstGroupVal(val)} items={firstGroup} />
      <div className="NewOrder_subtitle__2jMQG">Подгруппа товара</div>
      <Group items={secondGroup} />
    </div>
  )
}

const Button = (props) => {
  if (props.isLoading) {
    return (
      <button className="NewOrder_go__8hTne NewOrder_loading__10E5T" disabled>
        <div className="NewOrder_loader__3g6sw"></div>
      </button>
    )
  }

  return (
    <button className="NewOrder_go__8hTne">
      <span className="NewOrder_web__11j3A">Продолжить</span>
      <span className="NewOrder_noWeb__2yFIb">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle><path d="M12 16l4-4-4-4M8 12h8"></path>
        </svg>
      </span>
    </button>
  )
}

export default Search
