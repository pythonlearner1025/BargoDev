import cookie from "cookie";
import {roomId} from "../../../data/roomId";
import redis from "../../../utils/redis"

export default async function handle(req,res){

    const cookies = cookie.parse(req.headers.cookie || '');
    const desiredRole = req.body.role;
    const account = req.body.account;
    const thisUserCookie = cookies[account];
    const data = await redis.get(roomId)

    console.log("before logclick mod")
    console.log(data)

    if (desiredRole === "roleA" && data.roleA.id === "" 
    && data.roleB.id !== thisUserCookie){
        data.roleA.id = thisUserCookie;
    } else if (desiredRole === 'roleB' && data.roleB.id === ""
    && data.roleA.id !== thisUserCookie){
        data.roleB.id = thisUserCookie;
    }
    console.log('////////logClick/////////')
    console.log(data);
    console.log('///////logClickEnd///////')
    await redis.set(roomId, data)
    res.status(200).json({received: thisUserCookie})
}