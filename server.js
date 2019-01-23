const http = require("http");
const StringDecoder = require("string_decoder").StringDecoder;
const posts = require("./posts")

const httpServer = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Methods', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Allow-Headers', '*');
  if (request.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
  }

  let route = request.url;
  const method = request.method;
  let dynamicArguments = request.url.split("/");
  route = dynamicArguments[1];
  dynamicArguments = dynamicArguments.splice(2);
  const headers = request.headers;
  const decoder = new StringDecoder("utf8");
  let payload = "";
  request.on("data", data => {
    payload += decoder.write(data);
  });
  request.on("end", () => {
    payload += decoder.end();
    if (route === "forum" && method === "GET") {
      response.setHeader("Conent-Type", "application/json");
      response.writeHead(200);
      response.end(JSON.stringify({ post: 'En forum post' }));
    } else if (route === 'posts' && method === 'GET') {
      response.setHeader('Conent-Type', 'application/json');
      response.writeHead(200);
      response.end(JSON.stringify(posts));
    } else {
      response.writeHead(404);
      response.end('Sidan kunde inte hittas');
    }
  });
});

httpServer.listen(8000, () => console.log("Webbserver startad på port 1337"));
