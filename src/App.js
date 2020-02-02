import React, { useState } from 'react';
import './App.css';
import Search from './Search'
import Item from './Item'

function App() {
  const [products, setProducts] = useState([{}])

  const itemsTpl = products.map((p, i) => {
    return <Item item={p} key={i} />
  })

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <Search setProducts={setProducts} />
        </header>
      </div>
      <div>
        {itemsTpl}
      </div>
    </div>

  );
}

export default App;
