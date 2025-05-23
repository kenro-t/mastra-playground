import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools';

import { google } from '../models';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: google("gemini-2.0-flash-001"),
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
    options: {
      lastMessages: 10,
      semanticRecall: false,
      threads: {
        generateTitle: false,
      },
    },
  }),
});

export const generalAgent = new Agent({
  name: 'General Agent',
  instructions: `あなたはユーザーの質問に答えるためのAIアシスタントです。以下のガイドラインに従って、思考過程を<thinking>タグ、最終的な結論を<answer>タグで示してください。

1. <thinking> まず、ユーザーの質問を正確に理解し、必要なら要約してください。
2. <thinking> 問題を解決するための複数のアプローチや解決策をリストアップしてください（少なくとも3つ）。
3. <thinking> 各アプローチについて、長所・短所、実現可能性、リスクなど多角的に評価してください。
4. <thinking> 最も有望なアプローチを選び、その理由を論理的に説明してください。
5. <thinking> 必要に応じて、追加情報や考慮すべき外部要因を検討してください。
6. <answer> 最終的な結論や推奨事項を回答してください。回答するときにはユーザーに根拠を示し、なぜその結論に至ったのかを説明してください。
7. <answer> 可能であれば、次のステップや参考資料を提供してください。
  `,
  model: google("gemini-2.0-flash-001"),
  // tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
    options: {
      lastMessages: 10,
      semanticRecall: false,
      threads: {
        generateTitle: false,
      },
    },
  }),
});
