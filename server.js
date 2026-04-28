// server.js
import app from "./src/app.js";
import { supabase } from "./src/config/db.js";

async function start() {
  try {
    // Optional: Check Supabase connection or specific table existence here if needed
    // For now, we assume Supabase is ready.
    console.log("Conectado a Supabase (cliente inicializado)");

<<<<<<< HEAD
    app.listen(2000, () => console.log("Servidor corriendo en http://localhost:2000"));
=======
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
  } catch (err) {
    console.error("Error arrancando la app:", err);
    process.exit(1);
  }
}

start();
