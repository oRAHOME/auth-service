const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const app = express();

const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));

// Swagger UI
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
})