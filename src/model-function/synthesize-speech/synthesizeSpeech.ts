import { FunctionOptions } from "../../core/FunctionOptions.js";
import { AsyncQueue } from "../../event-source/AsyncQueue.js";
import { AsyncIterableResultPromise } from "../../model-function/AsyncIterableResultPromise.js";
import { ModelFunctionPromise } from "../ModelFunctionPromise.js";
import { executeStandardCall } from "../executeStandardCall.js";
import { executeStreamCall } from "../executeStreamCall.js";
import {
  DuplexSpeechSynthesisModel,
  SpeechSynthesisModel,
  SpeechSynthesisModelSettings,
} from "./SpeechSynthesisModel.js";

/**
 * Synthesizes speech from text.
 */
export function synthesizeSpeech(
  model: SpeechSynthesisModel<SpeechSynthesisModelSettings>,
  text: string,
  options?: FunctionOptions & {
    mode?: "standard";
  }
): ModelFunctionPromise<Buffer>;
export function synthesizeSpeech(
  model: DuplexSpeechSynthesisModel<SpeechSynthesisModelSettings>,
  text: AsyncIterable<string> | string,
  options: FunctionOptions & {
    mode: "stream-duplex";
  }
): AsyncIterableResultPromise<Buffer>;
export function synthesizeSpeech(
  model:
    | SpeechSynthesisModel<SpeechSynthesisModelSettings>
    | DuplexSpeechSynthesisModel<SpeechSynthesisModelSettings>,
  text: string | AsyncIterable<string>,
  options?: FunctionOptions & {
    mode?: "standard" | "stream-duplex";
  }
): ModelFunctionPromise<Buffer> | AsyncIterableResultPromise<Buffer> {
  const mode = options?.mode ?? "standard";

  switch (mode) {
    case "standard": {
      if (typeof text !== "string") {
        throw new Error(
          `The "standard" mode only supports a string input, but received ${text}`
        );
      }

      return new ModelFunctionPromise(
        executeStandardCall({
          functionType: "speech-synthesis",
          input: text,
          model,
          options,
          generateResponse: async (options) => {
            const response = await model.doSynthesizeSpeechStandard(
              text,
              options
            );

            return {
              response,
              extractedValue: response,
            };
          },
        })
      );
    }

    case "stream-duplex": {
      if (
        !("doSynthesizeSpeechStreamDuplex" in model) ||
        typeof model.doSynthesizeSpeechStreamDuplex !== "function"
      ) {
        throw new Error(
          `The "stream-duplex" mode is not supported by this model.`
        );
      }

      let textStream: AsyncIterable<string>;

      // simulate a stream with a single value for a string input:
      if (typeof text === "string") {
        const queue = new AsyncQueue<string>();
        queue.push(text);
        queue.close();
        textStream = queue;
      } else {
        textStream = text;
      }

      return new AsyncIterableResultPromise<Buffer>(
        executeStreamCall({
          functionType: "speech-synthesis",
          input: text,
          model,
          options,
          startStream: async (options) =>
            model.doSynthesizeSpeechStreamDuplex(textStream, options),
          processDelta: (delta) => {
            return delta.valueDelta;
          },
          getResult: () => ({}),
        })
      );
    }

    default: {
      const mode_: never = mode;
      throw new Error(`Unsupported mode: ${mode_}`);
    }
  }
}
