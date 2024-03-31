
import {  BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Your custom CSS here */

import ListAll from "./ListAll";
// import './App.css';
import GetDetails from "./GetDetails";
import ClientLayout from "./layout";
import Create from "./Create";
import { NetworkProvider } from "./context/NetworkProvider";
import Home from "./Home";
import SellNFTDetail from "./SellNFTDetail";
import MyCollection from "./MyCollection";
import UnSellNFTDetail from "./UnSellNFTDetail";

function App() {
  return (
    <div className="App">
      <NetworkProvider>
        <Router>
          <Routes>
          <Route path='/' element={<ClientLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/list" element={<ListAll/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/collection" element={<MyCollection/>}/>
            <Route path="/detail/:id" element={<SellNFTDetail/>} />
            <Route path="/unsell/detail/:id" element={<UnSellNFTDetail/>} />
            <Route path="/get-details" element={<GetDetails/>}/>
          </Route>
          </Routes>
        </Router>
      </NetworkProvider>
    </div>
  );
}

export default App;
