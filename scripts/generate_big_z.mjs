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
        else if (filename.includes('walk')) subfolder = 'walk';
        else if (filename.includes('punch_combo')) subfolder = 'punch_combo';
        else if (filename.includes('kick')) subfolder = 'kick';
        else if (filename.includes('jump')) subfolder = 'jump';
        else if (filename.includes('hurt')) subfolder = 'hurt';
        else subfolder = 'special'; // energy_blast, dash_attack, powerup

        const outputPath = path.join('/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/big_z', subfolder, filename.replace('.png', '') + '.png');

        fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
        console.log(`✅ Saved successfully to ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error generating ${filename}:`, error.message);
    }
}

async function main() {
    const baseDesc = "Same character as reference — athletic man in futuristic blue and white armor, wearing a blue baseball cap, EA shield logo on chest. Streets of Rage 2 style. Clean pixel art, bold outlines, 16-bit SEGA Genesis aesthetic.";

    const prompts = [
        {
            filename: "big_z_idle.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame fighting idle stance in a horizontal strip. ${baseDesc} Showing a subtle breathing/bouncing idle animation loop. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_walk.png",
            prompt: `16-bit pixel art sprite sheet: 8-frame walk cycle in a horizontal strip. ${baseDesc} He walks to the right in a confident stride, fists up in fighting stance. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_punch_combo.png",
            prompt: `16-bit pixel art sprite sheet: 9-frame punch combo attack in a horizontal strip. ${baseDesc} The combo is: 3 frames of jab (wind up, extend fist, retract), 3 frames of cross punch (wind up, extend other fist, retract), 3 frames of uppercut (crouch, launch upward, follow through). Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_kick.png",
            prompt: `16-bit pixel art sprite sheet: 5-frame forward kick attack sequence in a horizontal strip. ${baseDesc} Frame 1: wind up chambering knee, Frame 2: leg shooting forward, Frame 3: full extension powerful front kick, Frame 4: retracting leg, Frame 5: back to fighting stance. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_jump.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame jump sequence in a horizontal strip. ${baseDesc} Frame 1: crouch anticipation, Frame 2: launch upward with knees tucked, Frame 3: apex of jump arms up, Frame 4: falling down legs extended. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_hurt.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame hurt and knockdown sequence in a horizontal strip. ${baseDesc} Frame 1: hit stagger recoiling backwards with pain expression, Frame 2: stumbling further back off balance, Frame 3: falling to the ground, Frame 4: lying flat on back knocked down. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_energy_blast.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame energy blast attack in a horizontal strip. ${baseDesc} Frame 1-2: pulls hands back gathering blue energy, Frame 3: thrusts both palms forward releasing a blue energy projectile, Frame 4-5: energy wave fires forward with blue glow effects, Frame 6: recovery stance. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "big_z_dash_attack.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame dash attack in a horizontal strip. ${baseDesc} Frame 1: leans back preparing to charge, Frame 2: lunges forward with shoulder leading, motion blur lines, Frame 3: full extension shoulder bash impact, Frame 4: slide to a stop recovery. Character dashes to the right. Bright green (#00FF00) solid background. Speed lines.`
        },
        {
            filename: "big_z_powerup.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame power-up transformation sequence in a horizontal strip. ${baseDesc} Frame 1: standing with fists clenched at sides, Frame 2: crouching slightly as blue energy swirls around feet, Frame 3: rising up as blue fire aura surrounds body, eyes glowing, Frame 4-5: full power-up with massive blue flame aura engulfing character, glowing eyes, electricity crackling, Frame 6: powered-up fighting stance with blue flames still burning around body. Character faces right. Bright green (#00FF00) solid background. Dramatic energy VFX.`
        }
    ];

    for (const p of prompts) {
        await generateSprite(p.prompt, p.filename);
    }
}

main();
