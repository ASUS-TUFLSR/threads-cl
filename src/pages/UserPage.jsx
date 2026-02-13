import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost';

const UserPage = () => {
  return <>
    <UserHeader/>
    <UserPost likes={1200} replies={481} postImg="./post1.png" postTitle="Let's talk about threads." />
    <UserPost likes={190} replies={81} postImg="./post2.png" postTitle="Let's talk about threads." />
    <UserPost likes={100} replies={971} postImg="./post3.png" postTitle="Let's talk about threads." />
  </>
}

export default UserPage;