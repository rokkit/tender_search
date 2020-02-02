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
    productItems: [],
    query: '',
    pClassChoosed: null,
    tClassChoosed: null,
    batchNames: []
  }
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if(state.query === '') {
      return
    }
    setState(prevState => Object.assign({}, prevState, {
      isLoading: true
    }))
    fetchProducts(state.query, state.pClassChoosed, state.tClassChoosed).then(parseProducts)
  }, [state.query, state.pClassChoosed, state.tClassChoosed])

  useEffect(() => {
    if(state.batchNames.length == 0) return
    batchFetchProducts(state.batchNames).then(parseProducts)
  }, [state.batchNames])

  const onQueryChange = (val) => {
    if (val !== "") {
      setState(prevState => Object.assign({}, prevState, {
        isLoading: true,
        query: val
      }))
    } else {
      props.setProducts([])
      setState(prevState => initialState)
    }
  }

  const onPClassChange = (val) => {
    setState(prevState => Object.assign({}, prevState, {
      pClassChoosed: val
    }))
  }

  const onTClassChange = (val) => {
    setState(prevState => Object.assign({}, prevState, {
      tClassChoosed: val
    }))
  }

  const onDropChange = (val) => {
    setState(prevState => Object.assign({}, prevState, {
      batchNames: val
    }))
  }

  const parseProducts = (resp) => {
    const productItems = resp['payload']
    props.setProducts(productItems)
    setState(prevState => Object.assign({}, prevState, {
      isLoading: false,
      isChooserActive: true,
      productItems: productItems,
      firstGroup: resp['class_p']
    }))
  }

  const makeRequest = async (data) => {
    setState(prevState => Object.assign({}, prevState, {
      isLoading: true
    }))
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      mode: 'cors'
    };

    const response = await fetch("http://tenderfind.ru:7777/api/v2/themes/", requestOptions)
    const json = await response.json();
    return json['result']
  } 

  const batchFetchProducts = async (names) => {
    return await makeRequest({"texts": names})
  }

  const fetchProducts = async (val, pClass, tClass) => {
    return await makeRequest({
      "text": val,
      "class_p": pClass,
      "class_t": tClass
    })
  }

  const styles = {
    minWidth: 960
  }
  console.log('render')
  return (
    <div className="NewOrder_newClaim__3gVH9" style={styles}>
      <div className="NewOrder_newClaimAction__IicAX">
        <Input onQueryChange={onQueryChange} />
        {
          state.isChooserActive
          &&
          <Chooser onPClassChange={onPClassChange} onTClassChange={onTClassChange} firstGroup={state.firstGroup} items={state.productItems} isActive={state.isChooserActive} />
        }
        {!state.isChooserActive && <Drop isLoading={state.isLoading} onChange={onDropChange} />}
        <Button isLoading={state.isLoading} />
      </div>
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

const Chooser = (props) => {

  const [firstGroupVal, setFirstGroupVal] = useState('')
  const [secondGroupVal, setSecondGroupVal] = useState('')

  const onFirstGroupValChange = (val) => {
    setFirstGroupVal(val)
    props.onPClassChange(val)
  }

  const onSecondGroupValChange = (val) => {
    setSecondGroupVal(val)
    props.onTClassChange(val)
  }

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
    if(firstGroupVal != '' && firstGroupVal == p['Вид продукции']) {
      if(secondGroup.indexOf(p['Вид товаров']) == -1) {
        secondGroup.push(p['Вид товаров'])
      }
    }
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
