import React, { useState, useEffect } from 'react'

import './Search.css'

import Input from './Input'
import Drop from './Drop'
import Chooser from './Chooser'

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
      isLoading: true,
      isChooserActive: true
    }))
    fetchProducts(state.query, state.pClassChoosed, state.tClassChoosed).then(parseProducts)
  }, [state.query, state.pClassChoosed, state.tClassChoosed])

  useEffect(() => {
    if(state.batchNames.length == 0) return
    batchFetchProducts(state.batchNames).then(parseBatchProducts)
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
      batchNames: val,
      isChooserActive: false,
      isLoading: true
    }))
  }

  const onDrop = () => {
    setState(prevState => Object.assign({}, prevState, {
      isChooserActive: false,
      isLoading: true
    }))
  }

  const parseProducts = (resp) => {
    const productItems = resp['payload'] //removeDuplicates(resp['payload'], 'Id')
    document.getElementById('foundedCount').innerText = productItems.length
    props.setProducts(productItems)
    setState(prevState => Object.assign({}, prevState, {
      isLoading: false,
      isChooserActive: true,
      productItems: productItems,
      firstGroup: resp['class_p'],
      secondGroup: resp['class_t']
    }))
  }

  const removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  const parseBatchProducts = (resp) => {
    const productItems = removeDuplicates(resp['payload'], 'Id')
    document.getElementById('foundedCount').innerText = productItems.length
    props.setProducts(productItems)
    setState(prevState => Object.assign({}, prevState, {
      isLoading: false,
      isChooserActive: false,
      productItems: productItems,
      firstGroup: resp['class_p'],
      secondGroup: resp['class_t']
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
    var request = {text: val}
    if(pClass && pClass !== "") request["class_p"] = pClass
    if(tClass && tClass !== "") request["class_t"] = tClass
    return await makeRequest(request)
  }

  const styles = {
    minWidth: 960
  }

  return (
    <div className="NewOrder_newClaim__3gVH9" style={styles}>
      <div className="NewOrder_newClaimAction__IicAX">
        <Input onQueryChange={onQueryChange} />
        {
          state.isChooserActive
          &&
          <Chooser onPClassChange={onPClassChange} onTClassChange={onTClassChange} firstGroup={state.firstGroup} secondGroup={state.secondGroup} items={state.productItems} isActive={state.isChooserActive} isLoading={state.isLoading} />
        }
        {!state.isChooserActive && <Drop isLoading={state.isLoading} onDrop={onDrop} onChange={onDropChange} />}
        <Button isLoading={state.isLoading} />
      </div>
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
