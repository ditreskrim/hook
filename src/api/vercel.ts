import type { VercelRequest, VercelResponse } from '@vercel/node'
//import {app} from "../index";
export default function handler(req: VercelRequest, res: VercelResponse) {
  //  app.server.emit("request", req, res);
    const { name = 'World' } = req.query
    return res.json({
        message: `Hello ${name}!`,
    })
}
