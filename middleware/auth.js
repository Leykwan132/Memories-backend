import jwt from "jsonwebtoken";

// wants to like a post
// action that happens before something
// click the like button -> auth middleware (confirm/deny the request) (NEXT) => like controller
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // check Google token or our own token
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      // secret 'test' has to be the same when it is created.
      decodedData = jwt.verify(token, "test");

      // store user id
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      // identifier for google token
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
