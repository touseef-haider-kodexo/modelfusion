// https://openai.com/pricing
export const OPENAI_CHAT_MODEL_COSTS = {
  "gpt-4": {
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
  },
  "gpt-4o": {
    promptTokenCostInMillicents: 2,
    completionTokenCostInMillicents: 4,
  },
  "gpt-4-0314": {
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
  },
  "gpt-4-0613": {
    promptTokenCostInMillicents: 3,
    completionTokenCostInMillicents: 6,
    fineTunedPromptTokenCostInMillicents: null,
    fineTunedCompletionTokenCostInMillicents: null,
  },
  "gpt-4-turbo-preview": {
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-1106-preview": {
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-0125-preview": {
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-vision-preview": {
    promptTokenCostInMillicents: 1,
    completionTokenCostInMillicents: 3,
  },
  "gpt-4-32k": {
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-4-32k-0314": {
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-4-32k-0613": {
    promptTokenCostInMillicents: 6,
    completionTokenCostInMillicents: 12,
  },
  "gpt-3.5-turbo": {
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
    fineTunedPromptTokenCostInMillicents: 0.3,
    fineTunedCompletionTokenCostInMillicents: 0.6,
  },
  "gpt-3.5-turbo-0125": {
    promptTokenCostInMillicents: 0.05,
    completionTokenCostInMillicents: 0.15,
  },
  "gpt-3.5-turbo-1106": {
    promptTokenCostInMillicents: 0.1,
    completionTokenCostInMillicents: 0.2,
  },
  "gpt-3.5-turbo-0301": {
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
  },
  "gpt-3.5-turbo-0613": {
    promptTokenCostInMillicents: 0.15,
    completionTokenCostInMillicents: 0.2,
    fineTunedPromptTokenCostInMillicents: 1.2,
    fineTunedCompletionTokenCostInMillicents: 1.6,
  },
  "gpt-3.5-turbo-16k": {
    promptTokenCostInMillicents: 0.3,
    completionTokenCostInMillicents: 0.4,
  },
  "gpt-3.5-turbo-16k-0613": {
    promptTokenCostInMillicents: 0.3,
    completionTokenCostInMillicents: 0.4,
  },
} as const;

export type OpenAIChatResponse = {
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
};

type FineTuneableOpenAIChatModelType =
  | `gpt-3.5-turbo`
  | `gpt-3.5-turbo-0613`
  | `gpt-4-0613`;

type FineTunedOpenAIChatModelType =
  `ft:${FineTuneableOpenAIChatModelType}:${string}:${string}:${string}`;

export type OpenAIChatBaseModelType = keyof typeof OPENAI_CHAT_MODEL_COSTS;

export type OpenAIChatModelType =
  | OpenAIChatBaseModelType
  | FineTunedOpenAIChatModelType;

export const isOpenAIChatModel = (
  model: string
): model is OpenAIChatModelType =>
  model in OPENAI_CHAT_MODEL_COSTS ||
  model.startsWith("ft:gpt-3.5-turbo-0613:") ||
  model.startsWith("ft:gpt-3.5-turbo:");

export const calculateOpenAIChatCostInMillicents = ({
  model,
  response,
}: {
  model: OpenAIChatModelType;
  response: OpenAIChatResponse;
}): number | null => {
  if (!(model in OPENAI_CHAT_MODEL_COSTS)) return null;

  const { promptTokenCostInMillicents, completionTokenCostInMillicents } =
    OPENAI_CHAT_MODEL_COSTS[model as OpenAIChatBaseModelType];

  return (
    response.usage.prompt_tokens * promptTokenCostInMillicents +
    response.usage.completion_tokens * completionTokenCostInMillicents
  );
};
