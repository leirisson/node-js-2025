import { app } from "./main.js";

app.get("/hello", () => {
  return "Hello Word";
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP SERVER RUNING...💫");
  });
