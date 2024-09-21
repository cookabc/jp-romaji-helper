import cors from 'cors';
import express from 'express';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiroInstance = null;

const initializeKuroshiro = async () => {
  if (!kuroshiroInstance) {
    const kuroshiro = new (Kuroshiro.default || Kuroshiro)();
    await kuroshiro.init(new KuromojiAnalyzer());
    kuroshiroInstance = kuroshiro;
  }
  return kuroshiroInstance;
};

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/convert', async (req, res) => {
  const { text } = req.body;
  try {
    const kuroshiro = await initializeKuroshiro();
    const characters = text.split('');
    const convertedText = await Promise.all(characters.map(async char => {
      try {
        const romajiChar = await kuroshiro.convert(char, { to: 'romaji' });
        return char === romajiChar ? char : `${char}(${romajiChar})`;
      } catch (error) {
        console.warn(`Failed to convert character: ${char}`);
        return char;
      }
    }));
    const romaji = convertedText.join(' ').replace(/\s+/g, ' ').trim();
    res.json({ romaji });
  } catch (error) {
    console.error('Error converting text:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

initializeKuroshiro()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize Kuroshiro:', error);
    process.exit(1);
  });
