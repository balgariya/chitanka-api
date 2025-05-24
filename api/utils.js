/**
 * Validates the input word/phrase
 * @param {string} word - The word to validate
 * @returns {Object} - Validation result
 */
export function validateWord(word) {
  if (!word) {
    return {
      isValid: false,
      error: "Word parameter is required.",
    };
  }

  if (typeof word !== "string") {
    return {
      isValid: false,
      error: "Word must be a string",
    };
  }

  const trimmedWord = word.trim();

  if (trimmedWord.length === 0) {
    return {
      isValid: false,
      error: "Word cannot be empty",
    };
  }

  if (trimmedWord.length > 150) {
    return {
      isValid: false,
      error: "Word is too long (max 150 characters)",
    };
  }

  // Security validation patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(trimmedWord))) {
    return {
      isValid: false,
      error: "Invalid characters detected",
    };
  }

  // Check for excessive special characters that might indicate malicious input
  const specialCharCount = (trimmedWord.match(/[<>'"&]/g) || []).length;
  if (specialCharCount > trimmedWord.length * 0.3) {
    return {
      isValid: false,
      error: "Too many special characters",
    };
  }

  return {
    isValid: true,
    word: trimmedWord,
  };
}

/**
 * Creates a standardized error response
 * @param {string} message - Error message
 * @param {number} code - HTTP status code
 * @returns {Object} - Formatted error response
 */
export function createErrorResponse(message, code) {
  return {
    success: false,
    error: message,
    code: code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @returns {Object} - Formatted success response
 */
export function createSuccessResponse(data) {
  return {
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Sanitizes text content to prevent XSS and clean up formatting
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeText(text) {
  if (!text || typeof text !== "string") return "";

  return (
    text
      // Basic XSS prevention
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      // Clean up whitespace and formatting
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim()
  );
}

/**
 * Extracts and validates URLs from text
 * @param {string} text - Text containing potential URLs
 * @returns {string[]} - Array of valid URLs
 */
export function extractUrls(text) {
  if (!text) return [];

  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const urls = text.match(urlRegex) || [];

  return urls.filter((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });
}

/**
 * Formats Bulgarian text for better readability
 * @param {string} text - Bulgarian text to format
 * @returns {string} - Formatted text
 */
export function formatBulgarianText(text) {
  if (!text) return "";

  return (
    text
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/([,.!?;:])\s*/g, "$1 ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
