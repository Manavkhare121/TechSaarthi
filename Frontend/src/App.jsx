import { useState } from 'react'
import {Route,Routes} from "react-router-dom"
import Navbar from './Layout/Navbar.jsx'
import Userlogin from './Pages/Auth/Userlogin.jsx'
import Usersignup from './Pages/Auth/UserSignup.jsx'
import Main from './components/Main.jsx'
import './App.css'
import About from './components/About.jsx'
import Notice from "./components/Notice.jsx"
import CollegeInfo from "./Pages/User/UserForm.jsx"
import CollegeForm from './Pages/College/CollegeForm.jsx'
import Chatbot from './Layout/Chatbot.jsx'
import GovernmentForm from './Pages/Government/GovernmentForm.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/" element={<Navbar/>}/>
      <Route path="/main" element={<Main/>}/>
      <Route path="/UserLogin" element={<Userlogin/>}/>
      <Route path="/UserSignup" element={<Usersignup/>}/>
      <Route path="/About" element={<About/>}/>
      <Route path="/Notice" element={<Notice/>}/>
      <Route path="/CollegeInfo" element={<CollegeInfo/>}/>
      <Route path="/CollegeForm" element={<CollegeForm/>}/>
      <Route path="/chatbot" element={<Chatbot/>}/>
      <Route path="/GovernmentForm" element={<GovernmentForm/>}/>
    </Routes>

    </>
  )
}

export default App
