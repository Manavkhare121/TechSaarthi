import { useState } from 'react'
import {Route,Routes} from "react-router-dom"
import Navbar from './Layout/Navbar.jsx'
import Userlogin from './Pages/Auth/Userlogin.jsx'
import Usersignup from './Pages/Auth/UserSignup.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Navbar/>}/>
      <Route path="/UserLogin" element={<Userlogin/>}/>
      <Route path="/UserSignup" element={<Usersignup/>}/>
    </Routes>

    </>
  )
}

export default App
