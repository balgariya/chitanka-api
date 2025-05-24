import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { scrapeChitanka } from "./scraper.js";
import {
  validateWord,
  createErrorResponse,
  createSuccessResponse,
} from "./utils.js";

import { marked } from "marked";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());

// 150 requests in a minute per ip
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  message: createErrorResponse(
    "Too many requests. Please try again later.",
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json(
    createSuccessResponse({
      status: "healthy",
      service: "Chitanka Dictionary API",
      timestamp: new Date().toISOString(),
    })
  );
});

app.get("/api", async (req, res) => {
  try {
    const word = req.query.word || req.query.q;

    const validation = validateWord(word);
    if (!validation.isValid) {
      return res.status(400).json(createErrorResponse(validation.error, 400));
    }

    const result = await scrapeChitanka(word);

    if (!result) {
      return res
        .status(404)
        .json(createErrorResponse(`No definition found for "${word}"`, 404));
    }

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json(createErrorResponse("Internal server error", 500));
  }
});

app.get("/api/:word", async (req, res) => {
  try {
    const word = decodeURIComponent(req.params.word);

    const validation = validateWord(word);
    if (!validation.isValid) {
      return res.status(400).json(createErrorResponse(validation.error, 400));
    }

    const result = await scrapeChitanka(word);

    if (!result) {
      return res
        .status(404)
        .json(createErrorResponse(`No definition found for "${word}"`, 404));
    }

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json(createErrorResponse("Internal server error", 500));
  }
});

app.get("/", (req, res) => {
  try {
    const readmePath = path.join(process.cwd(), "README.md");
    const markdownContent = fs.readFileSync(readmePath, "utf8");
    const htmlContent = marked(markdownContent);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chitanka Dictionary API</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                  color: #333;
                  background-color: #f8f9fa;
              }
              
              .markdown-body {
                  background: white;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              
              h1, h2, h3, h4, h5, h6 {
                  color: #2c3e50;
                  margin-top: 24px;
                  margin-bottom: 16px;
                  font-weight: 600;
                  line-height: 1.25;
              }
              
              h1 {
                  font-size: 2em;
                  border-bottom: 1px solid #eaecef;
                  padding-bottom: 10px;
              }
              
              h2 {
                  font-size: 1.5em;
                  border-bottom: 1px solid #eaecef;
                  padding-bottom: 8px;
              }
              
              pre {
                  background: #f6f8fa;
                  padding: 16px;
                  border-radius: 6px;
                  overflow-x: auto;
                  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                  font-size: 14px;
                  line-height: 1.45;
                  border: 1px solid #d0d7de;
              }
              
              code {
                  background: #f6f8fa;
                  padding: 0.2em 0.4em;
                  border-radius: 3px;
                  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                  font-size: 85%;
                  border: 1px solid #d0d7de;
              }
              
              pre code {
                  background: transparent;
                  padding: 0;
                  border: none;
              }
              
              blockquote {
                  border-left: 4px solid #0969da;
                  margin: 0;
                  padding: 0 16px;
                  color: #656d76;
                  background: #f6f8fa;
                  border-radius: 0 6px 6px 0;
              }
              
              a {
                  color: #0969da;
                  text-decoration: none;
              }
              
              a:hover {
                  text-decoration: underline;
              }
              
              img {
                  max-width: 100%;
                  height: auto;
                  vertical-align: middle;
              }
              
              p img[src*="shields.io"], p img[src*="img.shields.io"] {
                  display: inline-block;
                  margin: 2px;
              }
              
              div[align="center"], .center {
                  text-align: center;
              }
              
              table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 16px 0;
              }
              
              table th, table td {
                  border: 1px solid #d0d7de;
                  padding: 8px 12px;
                  text-align: left;
              }
              
              table th {
                  background: #f6f8fa;
                  font-weight: 600;
              }
              
              ul, ol {
                  padding-left: 2em;
              }
              
              li {
                  margin: 0.25em 0;
              }
              
              hr {
                  border: none;
                  border-top: 1px solid #d0d7de;
                  margin: 24px 0;
              }
              
              strong {
                  font-weight: 600;
              }
              
              em {
                  font-style: italic;
              }
              
              .markdown-body > *:first-child {
                  margin-top: 0 !important;
              }
              
              .markdown-body > *:last-child {
                  margin-bottom: 0 !important;
              }
          </style>
      </head>
      <body>
          <div class="markdown-body">
              ${htmlContent}
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error reading README:", error);
    res
      .status(500)
      .json(createErrorResponse("Could not load documentation", 500));
  }
});

app.use("*", (req, res) => {
  res.status(404).json(createErrorResponse("Endpoint not found", 404));
});

app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);
  res.status(500).json(createErrorResponse("Internal server error", 500));
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`📖 Documentation: http://localhost:${PORT}`);
  console.log(`🔍 Example: http://localhost:${PORT}/api?word=къща`);
});
