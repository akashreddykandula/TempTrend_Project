const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file
const filePath = "contactData.json";

// Route to handle contact form submissions
app.post("/saveContact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newEntry = {
        name,
        email,
        message,
        timestamp: new Date().toLocaleString(),
    };

    // Read existing data or initialize an empty array
    let contacts = [];
    if (fs.existsSync(filePath)) {
        try {
            const fileData = fs.readFileSync(filePath, "utf8");
            contacts = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading JSON file:", error);
            contacts = [];
        }
    }

    // Add new entry to the list
    contacts.push(newEntry);

    // Save back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

    console.log("✅ New message saved:", newEntry);

    res.json({ success: "Message saved successfully!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
