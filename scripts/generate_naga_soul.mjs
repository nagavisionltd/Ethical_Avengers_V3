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

        const outputPath = path.join('/Users/nagavision/Ethical_Avengers_V3/assets/images/characters/naga_soul', subfolder, filename.replace('.png', '') + '.png');

        fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
        console.log(`✅ Saved successfully to ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error generating ${filename}:`, error.message);
    }
}

async function main() {
    const baseDesc = "Same character as reference — a bald black man with a scarred face wearing a dark gas mask with glowing green eyes. He wields a glowing green energy sword (like a lightsaber). He is wearing full black futuristic plate armor and a long black trench coat. EA shield logo on chest. Streets of Rage 2 style 16-bit pixel art fighting game sprite, bold outlines, SEGA Genesis aesthetic.";

    const prompts = [
        {
            filename: "naga_soul_idle.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame fighting idle stance in a horizontal strip. ${baseDesc} He holds the glowing green sword at the ready in a two-handed grip. Showing a subtle breathing/bouncing idle animation loop, trench coat swaying slightly. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_walk.png",
            prompt: `16-bit pixel art sprite sheet: 8-frame walk cycle in a horizontal strip. ${baseDesc} He walks to the right in a confident stride, holding his glowing green energy sword out, trench coat flapping in motion. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_punch_combo.png",
            prompt: `16-bit pixel art sprite sheet: 9-frame sword combo attack in a horizontal strip. ${baseDesc} The combo is: 3 frames of horizontal slash (wind up, sweeping horizontal cut with green energy trail, follow through), 3 frames of vertical strike (raise sword high, bring down in a devastating overhead chop, recover), 3 frames of rising spin slash (crouch, launch upward spinning with sword extended in a green energy arc). Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_kick.png",
            prompt: `16-bit pixel art sprite sheet: 5-frame forward sword thrust attack sequence in a horizontal strip. ${baseDesc} Frame 1: draws sword back chambering for thrust, Frame 2: lunges forward extending arm, Frame 3: full extension powerful sword thrust with bright green energy flare at the tip, Frame 4: retracting sword, Frame 5: back to fighting stance. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_jump.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame jump sequence in a horizontal strip. ${baseDesc} He holds his glowing green sword tightly. Frame 1: crouch anticipation, Frame 2: launch upward with knees tucked, Frame 3: apex of jump, Frame 4: falling down legs extended. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_hurt.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame hurt and knockdown sequence in a horizontal strip. ${baseDesc} Green sword is deactivated or dropped. Frame 1: hit stagger recoiling backwards with pain expression, Frame 2: stumbling further back off balance, Frame 3: falling to the ground, Frame 4: lying flat on back knocked down. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_energy_blast.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame energy blast attack in a horizontal strip. ${baseDesc} Frame 1-2: holds green sword high, gathering vibrant green energy into the blade, Frame 3: swings sword down pointing forward releasing a green energy projectile, Frame 4-5: energy wave fires forward from the sword with bright green glow effects, Frame 6: recovery stance. Character faces right. Bright green (#00FF00) solid background.`
        },
        {
            filename: "naga_soul_dash_attack.png",
            prompt: `16-bit pixel art sprite sheet: 4-frame dash attack in a horizontal strip. ${baseDesc} Frame 1: leans back holding glowing green sword low to the side, preparing to charge, Frame 2: lunges forward with sword pointing straight ahead, motion blur lines, Frame 3: full extension charging sword thrust impact with green energy burst, Frame 4: slide to a stop recovery. Character dashes to the right. Bright green (#00FF00) solid background. Speed lines.`
        },
        {
            filename: "naga_soul_powerup.png",
            prompt: `16-bit pixel art sprite sheet: 6-frame power-up transformation sequence in a horizontal strip. ${baseDesc} Frame 1: standing holding glowing green sword, Frame 2: crouching slightly as green energy swirls around feet and sword blade, Frame 3: rising up as green fire aura surrounds body and sword pulse with intense light, eyes of gas mask glowing green, Frame 4-5: full power-up with massive green flame/fire aura engulfing character and sword, electricity crackling, Frame 6: powered-up fighting stance with green flames burning deeply around body and blade. Character faces right. Bright green (#00FF00) solid background. Dramatic energy VFX.`
        }
    ];

    for (const p of prompts) {
        await generateSprite(p.prompt, p.filename);
    }
}

main();
