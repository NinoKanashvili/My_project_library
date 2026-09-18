import { useState } from 'react'
import Login from './pages/Login'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Profile from './pages/Profile'
import { Route, Routes } from 'react-router-dom'
import Registration from './pages/Registration'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AddBook from './pages/AddBook'



function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Books/>} />
        <Route path='/login/' element={<Login/>}/>
        <Route path='/register/' element={<Registration/>} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path='/profile/' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='/books/add/' element ={<ProtectedRoute> <AddBook /> </ProtectedRoute>} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
