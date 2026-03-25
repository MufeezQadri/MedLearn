import { env } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(`MedLearn API listening on http://localhost:${env.PORT}`);
});
