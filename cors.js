const allowedOrigins = [
    process.env.CORS_URL,
 ];
 
 const corsOptions = {
    origin: (origin, callback) => {
       if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
       } else {
          callback(new Error('Not allowed by CORS'));
       }
    },
    credentials: true,
 };
 
 module.exports = corsOptions;