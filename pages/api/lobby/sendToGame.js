import redis from "../../../utils/redis"
import {roomId} from "../../../data/roomId"
import {gameParams} from "../../../data/gameParams"
import {gameState} from "../../../data/gameState"

// first randomly create game, add that to the db, and send
// client to game room
export default async function handle(req, res){

    console.log('//////////// in send to game ////////////////')
    /*
    current issue:
    because the re-direct is being initiated from client side,
    both players are calling this API request and as a consequence
    the saving/writing to redis part is being repeated twice, causing
    bugs. Ideally, the game randomization assignment task will be handled
    by the server alone and clients will only be sent the redirect request.
    This feature shall be added later. As of now, we restrict both clients 
    from running API code by disallowing the late client. Early client is the one who 
    called this API first and added to redis db first (checked by assiging to data.gameParams
    and changing its value from undefined to game data) 
    */
    const data = await redis.get(roomId)
    if (data.interests === undefined){
        // array of possible scores
        const thisGame = randomAssign(gameParams, gameParams.scores)

        data.gameParams = thisGame.interests
        data.interests = 'done'
        console.log('data snapshot', data)
        await redis.set(roomId, data)
        // if below doesn't work, revert to router.push in lobby.
        res.status(200).json()
    } else {
        res.status(200).json()
    }
}

function randomAssign(game, scores){
    for (let i=0;i<game.interests.length;i++){
        const randIndex = getRandomIntInclusive(0, scores.length-1)
        // shuffle if illogical type, else keep order
        if (game.interests[i].type === 'illogical') {
            game.interests[i].scores = shuffle(scores[randIndex])
        } else {
            game.interests[i].scores = scores[randIndex]
        }
        // remove inserted from scores list
        scores.splice(randIndex, 1)
    }
    return game
}
// get random val between min, max, inclusive
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

function shuffle(ar) {
    let currentIndex = ar.length 
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [ar[currentIndex], ar[randomIndex]] = [
        ar[randomIndex], ar[currentIndex]];
    }
    return ar;
}