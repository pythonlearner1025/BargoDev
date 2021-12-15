import {roomId} from "../../data/roomId"
import redis from "../../utils/redis"

export default async function handle(req,res){
   const data = await redis.get(roomId)
    if (data.roleA.ready === true &&
        data.roleB.ready === true){
            res.status(200).json({ready: true});
        } else {
            res.status(201).json({ready: false});
        } 
}