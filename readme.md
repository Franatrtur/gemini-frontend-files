# Gemini Filesystem Polyfill for Browser

Loading files to Gemini API from the browser is not possible as this feature is in the nop file `server.js`, which expects to run in a server environment (node).

This project provides a simple polyfill to enable the Google Generative AI (GenAI) Node.js SDK's file handling functionality within a web browser environment. It uses FileReader to load files into memory, simulating the `fs.readFileSync` behavior required by the GenAI SDK.

### Usage:

1. Include googleai.js (not modified, just a copy of original from google) server-not.js (modified!) in your HTML.
2. Use `bindGeminiFile(file, fileName)` to load a file into `window.GeminiFiles`.
3. Use the filename as `filePath` when calling `GoogleAIFileManager.uploadFile`.

### Example:

__FOR FULL EXAMPLE__, SEE `example.js`

```javascript
const file = document.getElementById('fileInput').files[0];
bindGeminiFile(file, 'my_file.txt');

// ... later, in your GenAI code ...
GoogleAIFileManager.uploadFile('my_file.txt', {/*metadata as normal*/});
```

### Key Features:

* Enables file uploads for the GenAI SDK in browser-based applications.
* Uses FileReader API for client-side file reading.
* Maintains compatibility with the existing GenAI SDK structure.

### Disclaimer:

This polyfill is intended for development and testing purposes.  Storing large files directly in browser memory might impact performance. For production, consider alternative approaches such as server-side file handling or using a dedicated file storage service.

__Accessing the Gemini API through the browser means you have to (at least) encrypt your API KEY if making the project public__. There are risks associated with the browser approach.

### Credits:

Based on the Google Generative AI Node.js SDK.  This polyfill provides a browser-compatible adaptation.

Made by Franatrtur