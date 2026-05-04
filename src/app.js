import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js"; // Importar rutas de home
import chapterRoutes from "./routes/chapter.routes.js"; // Importar rutas de capítulos
import sesion from "express-session"; // Importar express-session

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), "public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// Configuración de la sesión
app.use(
  sesion({
    secret: process.env.SESSION_SECRET || "willpig_studio_secret_key", // Usa env var si esta disponible.
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("landing", { loggerUser: req.session.user });
});

import storyRoutes from "./routes/story.routes.js"; // Importar rutas de historias
import userRoutes from "./routes/user.routes.js"; // Importar rutas de usuario

app.use("/auth", authRoutes);
app.use("/principal", homeRoutes);
app.use("/capitulos", chapterRoutes);
app.use("/historias", storyRoutes);
app.use("/usuario", userRoutes); // Montar rutas de usuario
app.use("/uploads", express.static("uploads"));
/*app.use("/")*/


export default app;
