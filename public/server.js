const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const sectionsFilePath = path.join(__dirname, 'sections.json');

const readSections = () => {
    const data = fs.readFileSync(sectionsFilePath, 'utf8');
    return JSON.parse(data);
};

const writeSections = (sections) => {
    fs.writeFileSync(sectionsFilePath, JSON.stringify(sections, null, 2));
};

app.get('/api/sections', (req, res) => {
    const sections = readSections();
    res.json(sections);
});

app.post('/api/sections', (req, res) => {
    const sections = readSections();
    const newSection = { id: uuidv4(), ...req.body };
    sections.push(newSection);
    writeSections(sections);
    res.status(201).json(newSection);
});

app.delete('/api/sections/:id', (req, res) => {
    let sections = readSections();
    sections = sections.filter(section => section.id !== req.params.id);
    writeSections(sections);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
