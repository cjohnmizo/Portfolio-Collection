const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the 'bootstrap-portfolio-collection' directory as the root
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
