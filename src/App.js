import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import Rooms from './components/Rooms/index'
import Game from './components/Game/index'
import { SocketProvider } from './socketContext'
import './App.css'
import { ChakraProvider, Flex } from "@chakra-ui/react"
import { UsersProvider } from './usersContext'
import DefaultPage from './components/DefaultPage'

function App() {
  return (
    <ChakraProvider>
      <UsersProvider>
        <SocketProvider>
          <Flex className="App" align='center' justifyContent='center'>
            <Router>
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/chat' component={Chat} />
                <Route path='/rooms' component={Rooms} />
                <Route path='/game/:room_name' component={Game} />
                <Route component={DefaultPage} />
              </Switch>
            </Router>
          </Flex>
        </SocketProvider>
      </UsersProvider>
    </ChakraProvider>
  );
}

export default App;
