export const extractJSON = (html: string, variable: string): any => {
  // 1. Find the start of the variable assignment
  // We look for common patterns like 'var variable =' or 'window["variable"] ='
  const patterns = [
    `var ${variable} =`,
    `var ${variable}=`,
    `window["${variable}"] =`,
    `window["${variable}"]=`,
    `${variable} =` // Sometimes it's just a global assignment
  ];

  let startIndex = -1;
  for (const pattern of patterns) {
    const idx = html.indexOf(pattern);
    if (idx !== -1) {
      startIndex = idx + pattern.length;
      break;
    }
  }

  if (startIndex === -1) return null;

  // 2. Locate the first opening brace '{' after the assignment
  // We allow up to 100 characters of whitespace/junk before the JSON starts
  let jsonStart = -1;
  for (let i = startIndex; i < startIndex + 100; i++) {
    if (html[i] === '{') {
      jsonStart = i;
      break;
    }
  }

  if (jsonStart === -1) return null;

  // 3. Count braces to find the end
  let openBraces = 0;
  let inString = false; // Ignore braces inside text strings like " { "
  let isEscaped = false; // Ignore quotes if they are escaped \"

  for (let i = jsonStart; i < html.length; i++) {
    const char = html[i];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === '{') {
        openBraces++;
      } else if (char === '}') {
        openBraces--;
      }
    }

    // When braces assume balance (0), we found the end
    if (openBraces === 0) {
      const jsonString = html.substring(jsonStart, i + 1);
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        // If we extracted bad JSON, continue searching (fallback)
        console.error("Parsed invalid JSON, ignored.");
        return null;
      }
    }
  }

  return null;
};  