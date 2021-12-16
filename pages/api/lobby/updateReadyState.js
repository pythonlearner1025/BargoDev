import cookie from "cookie";
import {roomId} from "../../../data/roomId";
import redis from "../../../utils/redis";


export default async function handle(req,res){
    const cookies = cookie.parse(req.headers.cookie);
    const account = req.body.account;
    const readyState = req.body.readyState;
    const thisUserCookie = cookies[account];

    const data = await redis.get(roomId)
    if (data.roleA.id === thisUserCookie){
        data.roleA.ready = readyState;
    } else if (data.roleB.id === thisUserCookie){
        data.roleB.ready = readyState;
    }
    
    await redis.set(roomId, data) 
    res.status(200).json({result: 'update success'});
}