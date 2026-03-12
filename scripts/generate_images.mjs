import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("❌ No API key found in GEMINI_API_KEY or GOOGLE_API_KEY environment variables.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

async function generateSprite(prompt, filename) {
    console.log(`Generating: ${filename} using imagen-4.0-generate-001...`);
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: "1:1",
                outputMimeType: "image/png"
            }
        });

        const base64Image = response.generatedImages[0].image.imageBytes;
        const outputPath = path.join('/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/leon_g/kick', filename.replace('.png', '') + '.png');

        fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
        console.log(`✅ Saved successfully to ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error generating ${filename}:`, error.message);
    }
}

async function main() {
    const kickPrompt = "16-bit pixel art sprite sheet: 5-frame forward kick attack sequence. Same character as reference — large muscular Black man in gold/yellow futuristic armor, black durag, gold gauntlets, EA shield on chest. Streets of Rage 2 style. Frame 1: wind up chambering knee, Frame 2: leg shooting forward, Frame 3: full extension powerful front kick, Frame 4: retracting leg, Frame 5: back to fighting stance. Character faces right. Bright green (#00FF00) solid background. Clean pixel art, bold outlines, 16-bit SEGA Genesis aesthetic.";

    await generateSprite(kickPrompt, "leon_g_kick.png");
}

main();
