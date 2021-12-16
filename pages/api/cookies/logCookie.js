import cookie from "cookie";
import sha256 from "js-sha256";


export default function handle(req,res){
    // hash using account + ip
    var account = req.body.account.toString();
    var ip = req.socket.remoteAddress;
    var hash = sha256.create();
    hash.update(account+ip);
    hash.hex();

    console.log(hash);
    res.setHeader("Set-Cookie", cookie.serialize(account, hash, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        // hour
        maxAge: 60 * 5,
        sameSite: "strict",
        // send to these URL paths
        path: "/",
    }))

    /*
    var cookies = cookie.parse(req.headers.cookie);
    console.log(cookies);
    var session = cookies[account];
    console.log('log cookie by account?' + session)

    */
    res.status(200).json({session: account,ip: ip,})

    // push cookie into temporary db
    //cookieStore.push({account: account})
}