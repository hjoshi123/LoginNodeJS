module.exports = {
  "url": "mongodb://hemant:hjoshi123@ds263988.mlab.com:63988/expense",
  "twitterAuth": {
    "consumerKey": process.env.CONSUMER_KEY,
		"consumerSecret": process.env.CONSUMER_SECRET,
    "callbackURL": "http://127.0.0.1:8080/auth/twitter/callback"
  },
  "googleAuth": {
    "clientID": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "callbackURL": "http://127.0.0.1:8080/auth/google/callback" 
  }
};
