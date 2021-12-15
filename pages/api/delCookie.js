import cookie from "cookie";

export default function handle(req,res){
    var account = req.body.account;
    res.setHeader("Set-Cookie", 
        cookie.serialize(account, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
    }))
    res.status(200).json({name: "delCookie"})
}