import { createServer } from "node:http";

const server = createServer((req, res) => {
  console.log(req.method, req.url);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "hello" }));
  console.log("Stani");
  // console.log(req.body);

  const pieces: string[] = [];

  req.on("data", (chunk) => {
    pieces.push(chunk.toString());
  });

  req.on("end", () => {
    try {
      const body = JSON.parse(pieces.join(""));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ received: body }));
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  });
});

server.listen(3000, () => console.log("http://localhost:3000"));
