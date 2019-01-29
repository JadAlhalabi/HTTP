const http = require("http");
const StringDecoder = require("string_decoder").StringDecoder;
const posts = require("./posts");

const httpServer = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Methods", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  response.setHeader("Access-Control-Allow-Headers", "*");
  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
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
      response.end(JSON.stringify({ post: "En forum post" }));
    } else if (route === "posts" && method === "GET") {
      if (dynamicArguments.length === 0) {
        response.setHeader("Conent-Type", "application/json");
        response.writeHead(200);
        response.end(JSON.stringify(posts));
      } else {
        const id = dynamicArguments[0];
        const post = posts.filter(post => post.id == id);
        response.setHeader("Conent-Type", "application/json");
        response.writeHead(200);
        response.end(JSON.stringify(post));
      }
    } else if (route === "posts" && method === "POST") {
      const data = JSON.parse(payload);
      const obj = {
        title: data.title,
        writtenBy: data.name,
        content: data.content,
        excerpt: data.content,
        id: posts.length + 1
      };
      console.log(obj);
      posts.push(obj);
    } else {
      response.end("Sidan kunde inte hittas");
    }
  });
});

httpServer.listen(8000, () => console.log("Webbserver startad på port 1337"));
