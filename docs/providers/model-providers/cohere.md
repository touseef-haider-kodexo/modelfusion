---
sidebar_position: 3
---

# Cohere

[API documentation](/api/modules/model_cohere)
|
[Basic Examples](https://github.com/lgrammel/ai-utils.js/tree/main/examples/basic/src/model/cohere)

## Import

```ts
import { CohereTextEmbeddingModel, ... } from "ai-utils.js/model/cohere";
```

## Example

```ts
const embeddingModel = new CohereTextEmbeddingModel({
  apiKey: COHERE_API_KEY,
  model: "embed-english-light-v2.0",
});

const response = await embeddingModel.embed([
  "At first, Nox didn't know what to do with the pup.",
  "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
]);

const embeddings = await embeddingModel.extractEmbeddings(response);
```

## Models

- [Text Generation Model](/api/classes/model_cohere.CohereTextGenerationModel)
- [Text Embedding Model](/api/classes/model_cohere.CohereTextEmbeddingModel)
- [Tokenization](/api/classes/model_cohere.CohereTokenizer)

## API Clients

- [Text Generation](/api/modules/model_cohere#generatecoheretextcompletion)
- [Embedding](/api/modules/model_cohere#generatecohereembedding)
- [Tokenize](/api/modules/model_cohere#tokenizecohere)
- [Detokenize](/api/modules/model_cohere#detokenizecohere)