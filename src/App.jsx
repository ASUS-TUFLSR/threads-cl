import { Button, Container } from '@chakra-ui/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'

const App = () => {
  return (
    <Container maxW="620px" >
      <Header/>
      <Routes>
        <Route path="/:username" element={<UserPage/>} />
        <Route path="/:username/post/:pid" element={<PostPage/>} />
      </Routes>
    </Container>
  )
}

export default App