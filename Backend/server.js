// ── CORS ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests without origin (Postman)
      if (!origin) return callback(null, true);

      // allow localhost and vercel deployments
      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true
  })
);