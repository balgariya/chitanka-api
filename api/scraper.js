import axios from "axios";
import * as cheerio from "cheerio";
import { sanitizeText } from "./utils.js";

/**
 * Scrapes Chitanka Dictionary for word definitions
 * @param {string} word - The word to search for
 * @returns {Object|null} - Scraped data or null if not found
 */
export async function scrapeChitanka(word) {
  try {
    const encodedWord = encodeURIComponent(word.trim());
    const url = `https://rechnik.chitanka.info/w/${encodedWord}`;

    const response = await axios.get(url, {
      timeout: 15000, //15 seconds
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "bg,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const $ = cheerio.load(response.data);

    const title = $("h1#first-heading").text().trim();
    if (!title || title.toLowerCase().includes("не съществува")) {
      return null;
    }

    const stressedWord = $("[id^='name-stressed_']").first().text().trim();

    const typeElement = $("[id^='type_']");
    let typeText = "";
    let typeLink = "";

    if (typeElement.length) {
      typeText = typeElement.text().trim();
      const linkElement = typeElement.find("a");
      if (linkElement.length) {
        const href = linkElement.attr("href");
        if (href) {
          typeLink = href.startsWith("http")
            ? href
            : `https://rechnik.chitanka.info${href}`;
        }
      }
    }

    let wordType = "";
    let wordClass = "";

    if (typeText) {
      const parts = typeText.split("(");
      wordType = parts[0]?.trim() || "";
      if (parts.length > 1) {
        wordClass = `(${parts.slice(1).join("(").trim()}`;
      }
    }

    const meaningElement = $("[id^='meaning_']");
    const meaning = meaningElement.length ? meaningElement.text().trim() : "";

    const synonyms = $(".synonyms .data").text().trim();

    const links = [];
    $(".links .data ul li").each((i, el) => {
      const linkText = $(el).text().trim();
      const linkElement = $(el).find("a");
      if (linkElement.length) {
        const linkUrl = linkElement.attr("href");
        if (linkText && linkUrl) {
          links.push({
            text: sanitizeText(linkText),
            url: linkUrl.startsWith("http")
              ? linkUrl
              : `https://rechnik.chitanka.info${linkUrl}`,
          });
        }
      }
    });

    const result = {
      word: sanitizeText(title || word),
      dictionaryUrl: url.replace(encodedWord, encodeURIComponent(word)),
    };

    if (stressedWord) {
      result.stressedWord = sanitizeText(stressedWord);
    }

    if (wordType) {
      result.wordType = sanitizeText(wordType);
    }

    if (wordClass) {
      result.wordClass = sanitizeText(wordClass);
    }

    if (typeLink) {
      result.typeLink = typeLink;
    }

    if (meaning) {
      result.meaning = sanitizeText(meaning);
    }

    if (synonyms) {
      result.synonyms = sanitizeText(synonyms);
    }

    if (links.length > 0) {
      result.links = links;
    }

    if (
      !meaning &&
      !stressedWord &&
      !wordType &&
      !synonyms &&
      links.length === 0
    ) {
      return null;
    }

    return result;
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.error("Chitanka Dictionary website is unreachable");
    } else if (error.response?.status === 404) {
      return null;
    } else if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      console.error("Connection timeout or reset when accessing Chitanka");
    } else {
      console.error("Error scraping Chitanka Dictionary:", error.message);
    }
    return null;
  }
}
