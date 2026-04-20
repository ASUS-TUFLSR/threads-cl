import React from 'react'
import SignupCard from '../components/SignUpCard'
import Login from '../components/Login'
import authScreenAtom from '../atoms/authAtom'
import { useRecoilValue } from 'recoil'

const AuthPage = () => {
 
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState)  

  return (
    <>
     {authScreenState === "login" ? <Login/> : <SignupCard/>}
    </>
  )
}

export default AuthPage