import redis from "../../../utils/redis"
import {roomId} from "../../../data/roomId"

export default async function handle(req, res){
    const data = await redis.get(roomId)
    const gameParams = data

    res.status(200).json({data: gameParams})
}