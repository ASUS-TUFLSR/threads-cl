import { Button, Container } from '@chakra-ui/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Container maxW="620px" >
      <Routes>
        <Route path="/:username" element={<UserPage/>} />
        <Route path="/:username/post/:pid" element={<PostPage/>} />
      </Routes>
    </Container>
  )
}

export default App