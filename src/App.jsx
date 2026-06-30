import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from './Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>} />
      </Routes>
    </BrowserRouter>
  )
}
