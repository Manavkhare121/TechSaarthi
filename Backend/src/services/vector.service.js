import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const techsarthiIndex = pc.Index("techsarthi");

async function createMemory({ vectors, metadata = {}, messageId }) {
  if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
    return;
  }

  await techsarthiIndex.upsert({
    records: [
      {
        id: String(messageId),
        values: Array.from(vectors),
        metadata,
      },
    ],
  });
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!Array.isArray(queryVector) || queryVector.length === 0) {
    return [];
  }

  const data = await techsarthiIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata?metadata:undefined,
    includeMetadata: true,
  });

  return data.matches;
}


export { createMemory, queryMemory };
