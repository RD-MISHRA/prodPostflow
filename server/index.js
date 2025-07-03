
require('dotenv').config(); // Load environment variables at the very top

const express = require("express");
const { TwitterApi } = require("twitter-api-v2");
const cors = require("cors");
const axios = require("axios"); // For Node.js
const jwt = require("jsonwebtoken"); // For JWT handling
const app = express();
app.use(express.json());
const User = require("./models/User"); // Adjust the path as necessary
const mongoose = require("mongoose");
const OAuth = require("oauth").OAuth;
const path = require("path");
const { OpenAI } = require("openai"); 
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const Post = require('./models/Post');
// Load environment variables
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY;
const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN; // Only for direct tweet endpoint
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET; // Only for direct tweet endpoint
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;


// CORS configuration
app.use(cors({
  origin: FRONTEND_URL, // Use production frontend URL from .env
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req, res, next) => {
  console.log("🌐 Incoming request from origin:", req.headers.origin);
  next();
});





mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Correct OAuth 1.0a client (v1.1 API) - This client is for the direct /tweet endpoint
// Consider if this is still needed if you only tweet via user-connected accounts.
const client = new TwitterApi({
  appKey: TWITTER_ACCESS_TOKEN, // Note: You were using access token here, should be appKey. Assuming previous was a typo.
  appSecret: TWITTER_ACCESS_SECRET, // Note: You were using access secret here, should be appSecret. Assuming previous was a typo.
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_SECRET
});

app.get('/tweet', async (req, res) => {
  const text = "rdx"; // This is a hardcoded tweet, likely for testing.
  if (!text) return res.status(400).json({ error: 'Tweet text is required' });

  try {
    const tweet = await client.v2.tweet(text);
    console.log('✅ Tweet posted:', tweet);
    res.status(200).json({ message: 'Tweet posted!', tweetId: tweet.data.id }); // Using data.id for v2 tweet response
  } catch (error) {
    console.error('❌ Tweet failed:', error);
    res.status(500).json({ error: 'Tweet failed', details: error.data || error.message });
  }
});


// Step 1: Redirect to Google OAuth
app.get("/api/auth/google", (req, res) => {
  console.log("GET /api/auth/google called");
// const redirect_uri = "http://localhost:5000/api/auth/google/callback";
  const redirect_uri = `${BACKEND_URL}/api/auth/google/callback`; // Use BACKEND_URL
  console.log("Redirect URI set:", redirect_uri);

  const scope = "openid email profile";
  console.log("Scope set:", scope);

  const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&prompt=select_account`;
  console.log("Constructed Google Auth URL:", authURL);

  res.redirect(authURL);
  console.log("Redirected to Google Auth URL");
});

app.get("/api/auth/google/callback", async (req, res) => {
  console.log("➡️ GET /api/auth/google/callback called");

  const code = req.query.code;
  const redirect_uri = `${BACKEND_URL}/api/auth/google/callback`; // Use BACKEND_URL

  console.log("🔐 Authorization code received:", code);
  console.log("🌐 Redirect URI for token exchange:", redirect_uri);

  try {
    console.log("📡 Requesting tokens from Google...");

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      }
    );

    console.log("✅ Token response received:", tokenResponse.data);

    const { access_token } = tokenResponse.data;
    console.log("🪪 Extracted access_token:", access_token);

    console.log("👤 Fetching user info from Google...");
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const user = userInfo.data;
    console.log("📥 User info received from Google:", user);

    console.log("🔎 Searching for existing user in DB...");
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      console.log("🆕 User not found. Creating new user...");

      existingUser = new User({
        googleId: user.sub,
        email: user.email,
        displayName: user.name,
        picture: user.picture,
      });

      await existingUser.save();
      console.log("✅ New user created and saved in DB:", existingUser);
    } else {
      console.log("🔁 Existing user found in DB:", existingUser);
    }

    console.log("🔑 Generating JWT...");
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ JWT generated:", token);

    const html = `
    <script>
    window.opener.postMessage({
    token: '${token}',
    type: 'auth'
    }, '${FRONTEND_URL}'); // Use production frontend URL
    window.close();
    </script>
    `;
    res.send(html);


  } catch (error) {
    console.error('Error during Google OAuth callback:', error);

    // Send error message to parent window and close the popup
    const errorMessage = 'An error occurred during authentication.';
    res.send(`
      <script>
        window.opener.postMessage({ error: '${errorMessage}' }, '*');
        window.close();
      </script>
    `);
  }
});


const callbackURL = `${BACKEND_URL}/auth/x/callback`; // Use BACKEND_URL
console.log("📦 Setting up Twitter OAuth");
const oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
  "1.0A",
  callbackURL,
  "HMAC-SHA1"
);

const tempStore = {}; // temporary storage of request token secrets

// Step 1: Redirect user to Twitter login
app.get("/auth/x", (req, res) => {
  const userToken = req.query.token; // read JWT token from frontend query param
  if (!userToken) {
    return res.status(401).send("Missing JWT token. Please login first.");
  }

  console.log("➡️ Received request at /auth/x with JWT:", userToken);

  oa.getOAuthRequestToken((err, oauth_token, oauth_token_secret) => {
    if (err) {
      console.error("❌ Error getting request token:", err);
      return res.status(500).send("Twitter login failed");
    }

    console.log("✅ Got request token:", { oauth_token, oauth_token_secret });

    // store the oauth_token_secret along with the userToken (JWT)
    tempStore[oauth_token] = { oauth_token_secret, userToken };

    const redirectURL = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    console.log("🔁 Redirecting user to Twitter login:", redirectURL);
    res.redirect(redirectURL);
  });
});

// Step 2: Twitter callback
app.get("/auth/x/callback", async (req, res) => {
  console.log("⬅️ Twitter redirected back to /auth/x/callback");
  const { oauth_token, oauth_verifier } = req.query;
  console.log("📥 Received query params:", { oauth_token, oauth_verifier });

  const session = tempStore[oauth_token];
  if (!session) {
    console.warn("⚠️ Missing session for oauth_token:", oauth_token);
    return res.status(400).send("Session expired. Try again.");
  }

  const { oauth_token_secret, userToken } = session;
  delete tempStore[oauth_token]; // cleanup memory

  let decoded;
  try {
    decoded = jwt.verify(userToken, JWT_SECRET);
  } catch (err) {
    console.error("❌ Invalid JWT token:", err);
    return res.status(401).send("Invalid user session");
  }

  const userId = decoded.id;
  console.log("🔐 JWT decoded user ID:", userId);

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found");

  oa.getOAuthAccessToken(
    oauth_token,
    oauth_token_secret,
    oauth_verifier,
    async (err, access_token, access_token_secret, result) => {
      if (err) {
        console.error("❌ Error exchanging token:", err);
        return res.status(500).send("Twitter login error");
      }

      console.log("✅ Access token obtained:", {
        access_token,
        access_token_secret,
        result,
      });

      const existingAccount = user.socialAccounts.find(
        acc => acc.platform === "twitter" && acc.username === result.screen_name
      );

      if (existingAccount) {
        existingAccount.accessToken = access_token;
        existingAccount.refreshToken = access_token_secret; // refresh token here is actually the access_token_secret for Twitter OAuth 1.0a
        existingAccount.connectedAt = new Date();
      } else {
        user.socialAccounts.push({
          platform: "twitter",
          username: result.screen_name,
          accessToken: access_token,
          refreshToken: access_token_secret, // refresh token here is actually the access_token_secret for Twitter OAuth 1.0a
        });
      }

      await user.save();
      console.log("💾 User updated with Twitter account:", result.screen_name);

      // Redirect back to frontend dashboard
      res.redirect(`${FRONTEND_URL}/dashboard`); // Use production frontend URL
    }
  );
});


const authenticateToken = (req, res, next) => {
  console.log("Authenticating token...");

  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.warn("No token provided");
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Token verified. Decoded payload:", decoded);
    req.userId = decoded.id;
    next();
  });
};

app.get("/api/auth/validate", authenticateToken, async (req, res) => {
  console.log("Token validated. Fetching user with ID:", req.userId);

  try {
    const user = await User.findById(req.userId);
    console.log("User lookup result:", user);

    if (!user) {
      console.warn("User not found for ID:", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found. Sending response...");
    res.json({
      email: user.email,
      name: user.displayName,
      photo: user.picture,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/social/twitter
app.get("/api/social/twitter", async (req, res) => {
  console.log("➡️ GET /api/social/twitter called");
  try {
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const twitterAccount = user.socialAccounts.find(acc => acc.platform === "twitter");

    if (!twitterAccount) {
      return res.json({ connected: false });
    }

    return res.json({
      connected: true,
      account: {
        username: twitterAccount.username,
        connectedAt: twitterAccount.connectedAt,
      },
    });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Post tweet endpoint
app.post("/api/social/twitter/tweet", async (req, res) => {
  console.log("➡️ POST /api/social/twitter/tweet called");

  try {
    const authHeader = req.headers.authorization;
    console.log("🔐 Checking Authorization Header:", authHeader);

    if (!authHeader) {
      console.log("❌ No Authorization header provided");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted token:", token);

    if (!token) {
      console.log("❌ Invalid token format");
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    console.log("🧾 Decoded user ID from token:", userId);

    const user = await User.findById(userId);
    console.log("👤 Fetched user:", user ? user.email : "User not found");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    const twitterAccount = user.socialAccounts.find(acc => acc.platform === "twitter");
    console.log("🐦 Twitter account info:", twitterAccount);

    if (!twitterAccount) {
      console.log("❌ Twitter account not connected");
      return res.status(400).json({ error: "Twitter account not connected" });
    }

    const { accessToken, refreshToken, username } = twitterAccount;
    const { text } = req.body;
    console.log("📝 Tweet text received:", text);

    if (!text || text.trim() === "") {
      console.log("❌ Empty or missing tweet text");
      return res.status(400).json({ error: "Tweet text is required" });
    }

    const client = new TwitterApi({
      appKey: TWITTER_APP_KEY, // Use appKey from .env
      appSecret: TWITTER_APP_SECRET, // Use appSecret from .env
      accessToken,
      accessSecret: refreshToken, // refresh token here is actually the access_token_secret for Twitter OAuth 1.0a
    });

    console.log("📡 Twitter API client initialized");

    const tweet = await client.v2.tweet(text);
    console.log("✅ Tweet posted:", tweet);

    return res.status(200).json({
      message: 'Tweet posted!',
      tweetId: tweet.data.id,
      username, // so you can build tweet link on frontend
    });
  } catch (error) {
    console.error("❌ Tweet failed:", error);
    return res.status(500).json({ error: "Tweet failed", details: error.data || error.message });
  }
});
const OPENAI_API_KEY=process.env.OPENAI_API_KEY
app.post('/api/generate-post', async (req, res) => {
  console.log("➡️ POST /api/generate-post called");
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE" || !OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API Key is not configured. Please replace 'YOUR_OPENAI_API_KEY_HERE' with your actual key." });
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a creative social media assistant. Generate two distinct social media posts based on the user's idea.
                  One post should be optimized for Twitter (concise, hashtags, emojis, max ~280 chars) and
                  the other for LinkedIn (professional, detailed, thought-provoking, suitable for a business network).
                  Provide the output as a JSON object with two keys: "twitterPost" and "linkedinPost".
                  Ensure the JSON is perfectly formatted and parseable.`,
      },
      {
        role: 'user',
        content: `Create social media posts for: ${prompt}`,
      },
    ];

    // Using fetch directly to OpenAI API
    const openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
    const openaiPayload = {
      model: 'gpt-3.5-turbo', // You can use other models like 'gpt-4o' if you have access
      messages: messages,
      response_format: { type: "json_object" }, // Instructs OpenAI to return JSON
    };

    const openaiResponse = await fetch(openaiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(openaiPayload)
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API Error Response:", errorData);
      throw new Error(`OpenAI API call failed with status ${openaiResponse.status}: ${JSON.stringify(errorData)}`);
    }

    const openaiResult = await openaiResponse.json();
    console.log("OpenAI API Raw Result:", openaiResult);

    if (openaiResult.choices && openaiResult.choices.length > 0 &&
        openaiResult.choices[0].message && openaiResult.choices[0].message.content) {
      const jsonString = openaiResult.choices[0].message.content;
      const parsedJson = JSON.parse(jsonString);

      if (parsedJson.twitterPost && parsedJson.linkedinPost) {
        res.json({
          twitterPost: parsedJson.twitterPost,
          linkedinPost: parsedJson.linkedinPost
        });
      } else {
        throw new Error("Unexpected JSON structure from LLM. Missing 'twitterPost' or 'linkedinPost'.");
      }
    } else {
      throw new Error("No valid content received from the OpenAI LLM.");
    }

  } catch (error) {
    console.error("Error generating posts:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});


app.post('/api/save-post', authenticateToken, async (req, res) => {
  console.log("➡️ POST /api/save-post called");
  const { content, title, platform } = req.body;
  const userId = req.userId; // Set by authenticateToken middleware

  if (!content || !title || !platform) {
    return res.status(400).json({ message: "Content, title, and platform are required." });
  }

  // Basic validation for platform
  const allowedPlatforms = ['Twitter', 'LinkedIn'];
  if (!allowedPlatforms.includes(platform)) {
    return res.status(400).json({ message: "Invalid platform specified." });
  }

  try {
    // Find the user to ensure userId is valid and connected (optional, but good practice)
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`Attempted to save post for non-existent user ID: ${userId}`);
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      userId: userId,
      platform: platform,
      title: title,
      content: content,
    });

    await newPost.save();
    console.log("Post saved successfully:", newPost);
    res.status(201).json({ message: "Post saved successfully!", post: newPost });

  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Error saving post.", error: error.message });
  }
});


app.get('/api/user-posts', authenticateToken, async (req, res) => {
  console.log("➡️ GET /api/user-posts called for userId:", req.userId);
  const userId = req.userId; // User ID from the authenticated token

  try {
    // Find all posts for the given userId, sorted by generatedAt in descending order
    const userPosts = await Post.find({ userId: userId }).sort({ generatedAt: -1 });

    console.log(`Found ${userPosts.length} posts for user ${userId}`);
    res.json({ posts: userPosts });

  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts.", error: error.message });
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});



app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
