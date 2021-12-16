import {roomId} from "../../../data/roomId";
import redis from "../../../utils/redis"

export default async function handle(req,res){
    console.log('///////isClickValid////');
    const data = await redis.get(roomId);
    console.log(data);
    console.log('/////isCLickValidEnd////');
    res.status(200).json({gameState: data})
}