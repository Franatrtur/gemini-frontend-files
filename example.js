
// Need to load googleai.js and server-not.js before this
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = genai;

// You SHOULD encrypt your API key, especially if making your project public!
// for this example, see github.com/Franatrtur/uluru-crypto
const apiKey = Uluru.decrypt(
    '9f6ce022b1990fa01iN3H11/J8gRpRkQ+Umcm6nHsBRAqApIHU1t8wGUDrIQqkf5hrja2a314d14cb1b0e2d400f0f2efb17857c',
    prompt("Secret password:")
);


const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// example usage:

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "You summarize and search through files",
});


document.getElementById("my_button").addEventListener('click', async function(e) {

    // get the file object
    const file = document.getElementById("my_file_input").files[0];

    if (file) {

        // send the file object to our hack
        await bindGeminiFile(file, "my_awesome_file.pdf")

        // now we can just pass in the filename (my_awesome_file) we defined earlier
        const files = [
            await uploadToGemini("my_awesome_file.pdf", "application/pdf"),
        ];
      
        // Some files have a processing delay. Wait for them to be ready.
        await waitForFilesActive(files);
        
        const chatSession = await model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        {text: "I have the following document:"},
                        {
                            fileData: {
                                mimeType: files[0].mimeType,
                                fileUri: files[0].uri,
                            },
                        },
                    ],
                },
            ],
        });

        let response = await window.chatSession.sendMessage("Summarize this document for me.")
        console.log(response)
        console.log(await response.response.text())
        
    } else {
        console.log("No files found.")
    }
});





// code from the gemini sdk:

async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".")
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name)
      }
      if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
      }
    }
    console.log("...all files ready\n");
  }