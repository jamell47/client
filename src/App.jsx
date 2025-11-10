import React from 'react';
import Register from './Register';
import Login from './Login'
import Dashboard from './Dashboard';
import Send from './Send'
import Withdraw from './Withdraw'
import Loan from './Loan'
import Pay from './pay'
import Account from './Account'
// import {useNavigate} from 'react-router-dom'zzzzz

import { BrowserRouter, Routes,Route } from 'react-router';
import './App.css'


function App() {

  return (
  <BrowserRouter>
  <Routes>
    <Route path="/Register" element={<Register/>}/>
        <Route path="/Login" element={<Login/>}/>
                <Route path="/Dashboard" element={<Dashboard/>}/>
                <Route path='/Send' element={ <Send/>}/>
                                <Route path='/Withdraw' element={ <Withdraw/>}/>
                                                                <Route path='/Loan' element={ <Loan/>}/>
                                                                <Route path='/pay' element={ <Pay/>}/>
                                                                                                                                <Route path='/Account' element={ <Account/>}/>

      
      

  </Routes>
  </BrowserRouter>
  )
}

export default App
