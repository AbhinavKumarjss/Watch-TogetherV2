// @ts-nocheck
import './App.css'
import Navbar from './Pages/Navbar/Navbar'
import Hero from './Pages/Hero/Hero'
import Room from './Pages/Room/Room'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
    <Router>
      <Routes>
        
        <Route path='/' element={<div>
          <Navbar/>
          <Hero />
          </div>
          } />


        <Route path='/room/:roomId' element={<Room />} />
        <Route path='/room/' element={<Room />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
