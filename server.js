const express= require("express");
const res = require("express/lib/response");
const app= express();
app.use(express.json());
const jwt = require('jsonwebtoken');


const fs = require('fs');
const passport = require('passport');
const passportJWT = require('passport-jwt');


// Configure passport to use JWT strategy
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
}, (jwtPayload, done) => {
  // Check if the user is authorized to access the API
  if (jwtPayload.username === 'admin') {
    return done(null, jwtPayload.username);
  } else {
    return done(null, false);
  }
}));

//winston logger
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
const add= (n1,n2) => {
    return n1+n2;
}
const sub= (n1,n2) => {
    return n1-n2;
}
const mul= (n1,n2) => {
    return n1*n2;
}
const div= (n1,n2) => {
    return n1/n2;
}
app.get('/add', passport.authenticate('jwt', { session: false }), (req, res) =>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for addition');
    const result = add(n1,n2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get('/subtract', passport.authenticate('jwt', { session: false }), (req, res) =>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for addition');
    const result = sub(n1,n2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get("/multiply", passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    logger.info('Parameters '+n1+' and '+n2+' received for addition');
    const result = mul(n1,n2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get("/divide",passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }
    
    if (n1 === NaN || n2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
    if (parseFloat(n2) === 0) {
        res.status(400).json({ error: 'n2 should not be zero' });
        return;
      }
    logger.info('Parameters '+n1+' and '+n2+' received for addition');
    const result = div(n1,n2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
// Login endpoint
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Authenticate user and generate JWT token
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'secret');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});
const port=3000;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
});