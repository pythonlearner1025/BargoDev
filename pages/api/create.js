import redis from '../../utils/redis'
import {roomId} from '../../data/roomId'
import {gameState} from '../../data/gameState'


// first create and upload game-datastore template to redis
// upon both users entering the room.
export default async function newGame(req, res) {
  console.log('pushing new val into redis');
  gameState.gameId = roomId
  const newState = gameState
  await redis.set(roomId, newState)
  res.status(200).json(); 
}