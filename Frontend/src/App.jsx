import { useState } from 'react'
import {Route,Routes} from "react-router-dom"
import Navbar from './Layout/Navbar.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Navbar/>}/>
    </Routes>

    </>
  )
}

export default App
