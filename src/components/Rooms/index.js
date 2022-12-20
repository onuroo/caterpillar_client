import { useContext, useEffect } from "react";
import { LinkBox, Heading, Box, LinkOverlay, Text, Flex, Input, IconButton } from "@chakra-ui/react"
import { RiArrowRightLine } from "react-icons/ri"
import { useHistory } from 'react-router-dom';

import { useToast } from "@chakra-ui/react";

import { SocketContext } from "../../socketContext";
import { useState } from "react/cjs/react.development";
import { UsersContext } from "../../usersContext";

const Rooms = () => {
  const socket = useContext(SocketContext);
  const {user} = useContext(UsersContext);

  const user_name = user;

  const history = useHistory();
  const toast = useToast();

  const [room_name, set_room_name] = useState(null);
  const [rooms, set_rooms] = useState([]);

  useEffect(() => {
    socket.emit('getRooms');

    socket.on('getRooms', rooms => {
      console.log('rooms', rooms)
      set_rooms(rooms);
    })
  }, []);

  const handleClick = () => {
    socket.emit('createRoom', { user_name, room_name }, error => {
      if (error) {
        console.log(error)
        return toast({
            position: "top",
            title: "Error",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
        })
      }
      history.push(`/game/${room_name}`, {
        room_name,
      });
      return toast({
          position: "top",
          title: "Hey there",
          description: `Created a Room`,
          status: "success",
          duration: 5000,
          isClosable: true,
      })
    });
  };
  
  const onClickJoin = (room_name) => {
    socket.emit('joinRoom', { user_name, room_name }, error => {
      if (error) {
        console.log(error)
        return toast({
            position: "top",
            title: "Error",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
        })
      }
      history.push(`/game/${room_name}`, {
        room_name
      });
      return toast({
          position: "top",
          title: "Hey there",
          description: `Joined a Room`,
          status: "success",
          duration: 5000,
          isClosable: true,
      })
    });
  };

  return (
    <div>
      <p>rooms</p>
      {rooms.map((room) => {
        return (
          <Box onClick={() => onClickJoin(room.name)} key={room.name} w='25vw' p={3}>
            <LinkBox as='article' maxW='sm' p='5' borderWidth='1px' rounded='md'>
              <Heading size='md' my='2'>
                <LinkOverlay href='#'>
                  {room.name}
                </LinkOverlay>
              </Heading>
              <Text>
                Onur
              </Text>
            </LinkBox>
          </Box>
        )
      })}
      <Text mt={10} mb={3}>
        Create a Room
      </Text>
      <Flex className="form" gap='1rem' flexDirection={{ base: "column", md: "row" }}>
          <Input
            variant='filled'
            mr={{ base: "0", md: "4" }}
            mb={{ base: "4", md: "0" }}
            type="text"
            placeholder='Room Name'
            value={room_name}
            onChange={e => set_room_name(e.target.value)}
          />
          <IconButton
            colorScheme='blue'
            isRound='true'
            icon={<RiArrowRightLine />}
            onClick={handleClick}>
          </IconButton>
      </Flex>
    </div>
  )
}

export default Rooms;