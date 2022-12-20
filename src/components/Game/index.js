import { useContext, useEffect, useRef } from "react";
import { useToast, Button } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { SocketContext } from "../../socketContext";
import { UsersContext } from "../../usersContext";
import { useState } from "react/cjs/react.development";

console.log('process.env.REACT_APP_PUBLIC_URL', process.env)
var CATERPILLER_HEAD_TILE = require('../../assets/caterpiller_head.png').default;
var CATERPILLER_BODY_TILE = require('../../assets/caterpiller_body.png').default;
var LEAF_TILE = require('../../assets/leaf.png').default;
// var CATERPILLER_HEAD_TILE = require('/../../assets/snake.png');

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 801;

const createBoard = (context, board = {}) => {
  const {
    users,
    wall,
    started,
  } = board;

  if (!started) return null;
  
  console.log('context', context)
  context.beginPath();
  // ctx.moveTo(i*cellSize, 0);
  // ctx.lineTo(i*cellSize, numCells*cellSize);

  context.strokeStyle = 'black';
  context.moveTo(wall.x, 0);
  context.lineTo(wall.x, 400);
  context.closePath();
  context.stroke();




  var caterpiller_head_image = new Image();
  caterpiller_head_image.src = CATERPILLER_HEAD_TILE;
  var caterpiller_body_image = new Image();
  caterpiller_body_image.src = CATERPILLER_BODY_TILE;
  var leaf_image = new Image();
  leaf_image.src = LEAF_TILE;
  console.log('caterpiller_head_image', caterpiller_head_image)

  // for (let i = 0; i < numCells + 1; i++) {
  //   ctx.moveTo(i*cellSize, 0);
  //   ctx.lineTo(i*cellSize, numCells*cellSize);

  //   ctx.moveTo(0, i*cellSize);
  //   ctx.lineTo(numCells*cellSize, i*cellSize);
  // }

  // DRAW CATERPILLERS

  function drawing() {
    board.users.forEach(user => {
      user.tiles.forEach((tile, index) => {
        if (index === 0) {
          context.drawImage(caterpiller_head_image, tile.x, tile.y, 10, 10);
        } else {
          context.strokeStyle = 'rgb(41, 192, 107)';
          context.roundRect(tile.x, tile.y, 10, 10 , 5);
          context.stroke();
          // context.drawImage(caterpiller_body_image, tile.x, tile.y, 10, 10);
          
        }
      });

      board.users.forEach(user => {
        console.log('user.foods', user.foods)
        user.foods?.forEach((food, index) => {
          if (food.state) context.drawImage(leaf_image, food.x, food.y, 10, 10);
        })
      })
    })
  }

  requestAnimationFrame(drawing);
};

const Game = () => {
  const socket = useContext(SocketContext);
  
  const canvasRef = useRef(null)
  const history = useHistory();
  const toast = useToast();
  let { room_name } = useParams();
  
  const [players, setPlayers] = useState([]);
  
  
  const {user} = useContext(UsersContext);
  const user_name = user;
  

  console.log('room_name', room_name)


  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    socket.emit('gameUpdate', { room_name });
    
    socket.on('gameUpdate', game => {
      console.log('board', game?.board)
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      console.log('context.canvas.width', context.canvas.width)
      createBoard(context, game.board);
    });

    socket.on('getUsers', users => {
      setPlayers(users);
      console.log('usersusersusers', users);
    })

    socket.emit('getUsers', { room_name }, error => {
      if (error) {
        toast({
            position: "top",
            title: "Error",
            description: error,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        history.push('/rooms');
      }
    });
  }, []);


  const downHandler = ({ key }) => {
    console.log('keykey', key)
    let direction = null;
    if (key === 'ArrowUp') {
      direction = 'up';
    } else if (key === 'ArrowLeft') {
      direction = 'left';
    } else if (key === 'ArrowDown') {
      direction = 'down';
    } else if (key === 'ArrowRight') {
      direction = 'right';
    } 

    if (direction) {
      socket.emit('setUserDirection', { user_name, room_name, direction });
    }
  }


  useEffect(() => {
    window.addEventListener("keydown", downHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  });


  

  useEffect(() => {
    socket.on("notification", notif => {
        toast({
            position: "top",
            title: notif?.title,
            description: notif?.description,
            status: "success",
            duration: 5000,
            isClosable: true,
        })
    })
}, [socket, toast])


  const onStartGame = () => {
    socket.emit('startGame', { user_name, room_name });
  };

  return (
    <div>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{borderWidth: 1, borderColor: '#5d4037', backgroundColor: '#5d4037'}} ref={canvasRef} />
      <h2><strong>Players</strong></h2>
      {players.map((player) => {
        return (
          <div>
            <p>
              {player.name}
            </p>
          </div>
        )
      })}
      {/* {console.log('22222 user_name', user_name)}
      {console.log('22222', players.find(player => player.name === user_name))} */}
      {console.log('players', players)}
      {players.find(player => player.name === user_name)?.creator && (
        <Button onClick={onStartGame} colorScheme='blue'>Start the game</Button>
      )}
    </div>
  )
};


export default Game;