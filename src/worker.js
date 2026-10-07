import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.localModelPath = '/models/';

let extractor = null;

self.addEventListener('message', async (event) => {
    const { type, text } = event.data;

    if (type === 'INIT') {
        try {
            // We added 'Xenova/' here to force the official cloud download
            extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', { quantized: true });
            self.postMessage({ status: 'READY' });
        } catch (error) {
            self.postMessage({ status: 'ERROR', error: error.message });
        }
    }

    if (type === 'EMBED') {
        try {
            if (!extractor) {
                throw new Error("AI Engine not initialized yet.");
            }
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            self.postMessage({ status: 'SUCCESS', text, embedding: Array.from(output.data) });
        } catch (error) {
            self.postMessage({ status: 'ERROR', error: error.message });
        }
    }
});