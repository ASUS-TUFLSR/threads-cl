import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Message = ({ownMessage}) => {
  return (
    <>
     {ownMessage ? (

         <Flex gap={2}  alignSelf={"flex-end"} >
            <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
                Lorem Ipsum St Bride Printing Library, 
                took a 1914 Cicero translation and scrambled 
            </Text>
            <Avatar src="" w="7" h={7} />
         </Flex>
    ) : (
        <Flex gap={2}  >
            <Avatar src="" w="7" h={7} />
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={'black'}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. ever since 1966.
            </Text>
         </Flex>
    )}
    </>
  )
}

export default Message