import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from "../components/Actions"
const Comment = ({reply, lastReply}) => {

  const {userProfilePic, text, username} = reply;

  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"} >
        <Avatar src={userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"} >
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} >
                <Text fontSize="sm" fontWeight="bold" >{username}</Text>
                <Flex gap={2} alignItems={"center"} >
                    <BsThreeDots/>
                </Flex>
            </Flex>
            <Text>{text}</Text> 
        </Flex>
    </Flex>
    {!lastReply ? <Divider /> : null} 
    </>
  )
}

export default Comment;