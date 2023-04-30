const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGES_PER_PAGE = 15;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function filterImages(files) {
  return files.filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()));
}

app.use(express.static('public'));

app.get('/api/images/:page/:limit', async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  try {
    const imageDir = './images';
    const files = fs.readdirSync(imageDir);
    const filteredFiles = filterImages(files);
    const totalPages = Math.ceil(filteredFiles.length / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(page * limit, filteredFiles.length);

    const images = filteredFiles.slice(startIndex, endIndex).map(file => ({
      src: `images/${file}`,
      alt: path.basename(file, path.extname(file)),
    }));

    const imageData = { images, totalPages };
    res.json(imageData);
  } catch (err) {
    console.error('Error reading images:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Image gallery server listening at http://localhost:${PORT}`);
});
