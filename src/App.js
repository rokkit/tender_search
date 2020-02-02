import React, { useState } from 'react';
import './App.css';
import Search from './Search'
import Item from './Item'

function App() {
  const [products, setProducts] = useState([])

  var ids = {}

  const itemsTpl = products.map((p, i) => {
    if(typeof(ids[p]) == 'undefined') {
      ids[p] = true
      return <Item item={p} key={i} />
    }
  })

  document.getElementById('foundedCount').innerText = itemsTpl.length

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <Search setProducts={setProducts} />
        </header>
      </div>
      <div id="itemsContainer">
        {itemsTpl}
      </div>
    </div>

  );
}

export default App;
