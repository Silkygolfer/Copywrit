import { Supermemory } from 'supermemory';

const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
});

export default supermemory;