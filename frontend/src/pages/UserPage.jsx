import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Spinner } from '@chakra-ui/react';

const UserPage = () => {

  const [user, setUser] = useState(null);
  const {username} = useParams();
  const showToast = useShowToast(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data)
        // console.log(data, "userPAge")
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false)
      }
    };
    getUser();
  }, [username, showToast])

  if(!user && loading){
    return (
      <Flex justifyContent={"center"} >
        <Spinner size="xl"/>
      </Flex>
    )
  }
  if(!user && !loading) return <h1>User not found!</h1>;

  return <>
    <UserHeader user={user} />
    <UserPost likes={1200} replies={481} postImg="./post1.png" postTitle="Let's talk about threads." />
    <UserPost likes={190} replies={81} postImg="./post2.png" postTitle="Let's talk about threads." />
    <UserPost likes={100} replies={971} postImg="./post3.png" postTitle="Let's talk about threads." />
  </>
}

export default UserPage;