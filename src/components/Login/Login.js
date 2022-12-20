import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from "@chakra-ui/react"
import { SocketContext } from '../../socketContext'
import { Flex, Heading, IconButton, Input } from "@chakra-ui/react"
import { RiArrowRightLine } from "react-icons/ri"
import { UsersContext } from '../../usersContext'

const Login = () => {
    const socket = useContext(SocketContext);

    const [name, setName] = useState('')

    const history = useHistory()
    const toast = useToast()
    const { setUser } = useContext(UsersContext)

    //Emits the login event and if successful redirects to chat and saves user data
    const handleClick = () => {
        socket.emit('login', { name }, error => {
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
            localStorage.setItem('cp_user', JSON.stringify(name));
            setUser(name);
            history.push('/rooms')
            return toast({
                position: "top",
                title: "Hey there",
                description: `Welcome`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        })
    }

    return (
        <Flex className='login' flexDirection='column' mb='8'>
            <Heading as="h1" size="4xl" textAlign='center' mb='8' fontFamily='DM Sans' fontWeight='600' letterSpacing='-2px'>Caterpiller.io</Heading>
            <Flex className="form" gap='1rem' flexDirection={{ base: "column", md: "row" }}>
                <Input variant='filled' mr={{ base: "0", md: "4" }} mb={{ base: "4", md: "0" }} type="text" placeholder='User Name' value={name} onChange={e => setName(e.target.value)} />
                <IconButton colorScheme='blue' isRound='true' icon={<RiArrowRightLine />} onClick={handleClick}></IconButton>
            </Flex>
        </Flex>
    )
}

export default Login
