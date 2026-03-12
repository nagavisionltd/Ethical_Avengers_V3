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
        // Determine subfolder based on filename
        let subfolder = '';
        if (filename.includes('idle')) subfolder = 'idle';
        else if (filename.includes('jump')) subfolder = 'jump';

        const outputPath = path.join('/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/naga_soul', subfolder, filename.replace('.png', '') + '.png');

        fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
        console.log(`✅ Saved successfully to ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error generating ${filename}:`, error.message);
    }
}

async function main() {
    const baseDesc = "Same character as reference — athletic man wearing a black gas mask, a long teal/cyan trench coat over dark tactical gear, EA shield logo on chest. Streets of Rage 2 style. Clean pixel art, bold outlines, 16-bit SEGA Genesis aesthetic.";

    const prompts = [
        {
            filename: "naga_soul_idle.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame fighting idle stance in a horizontal strip. ${baseDesc} Showing a subtle breathing/bouncing idle animation loop, trench coat swaying slightly. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_jump.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame jump sequence in a horizontal strip. ${baseDesc} Frame 1: crouch anticipation, Frame 2: launch upward with knees tucked, Frame 3: apex of jump arms up, Frame 4: falling down legs extended. Character faces right. Bright green (#00FF00) solid background.`
        }
    ];

    for (const p of prompts) {
        await generateSprite(p.prompt, p.filename);
    }
}

main();
