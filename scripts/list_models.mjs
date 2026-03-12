import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({});
async function main() {
    const models = await ai.models.list();
    for await (const model of models) {
        if (model.name.includes("image") || model.name.includes("imagen")) {
            console.log(model.name);
        }
    }
}
main();
