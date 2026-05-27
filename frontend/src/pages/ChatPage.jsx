import { Button } from '@chakra-ui/button'
import { SearchIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, Text } from '@chakra-ui/react'
import React from 'react'

const ChatPage = () => {
  return (
    <Box position={"absolute"} p={4}
         left={"50%"} w={{base:"100%", md:"80%", lg:"750px"}} transform={"translateX(-50%)"}
    >
       <Flex gap={4} flexDirection={{
        base:"column",
        md:"row"
       }}
        maxW={{
          sm:"400px",
          md:"full"
        }}
        mx={"auto"}
       >
          <Flex flex={30} >
            <Text></Text>
            <form>
               <Flex alignItems={"center"} >
                  <Input placeholder='Search for a user' />
                  <Button size={"sm"} >
                    <SearchIcon/>
                  </Button>

               </Flex>
            </form>
          </Flex>
          <Flex flex={70} >M Container</Flex>
       </Flex>
    </Box>
  )
}

export default ChatPage