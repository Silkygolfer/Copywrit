import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors"
import { getFile, uploadFile } from "./files";

const http = httpRouter();
const cors = corsRouter(http, {
    allowedOrigins: [
        "http://localhost:3000",
        'http://127.0.0.1:3210',
        "http://11.26.129.166:3000"
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true
})

cors.route({
    path: "/api/r2",
    method: "GET",
    handler: getFile
})

cors.route({
    path: "/api/upload",
    method: "POST",
    handler: uploadFile
})
  
export default http;