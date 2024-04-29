import { TaskType } from '@google/generative-ai'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { loadQAStuffChain } from 'langchain/chains'
import { EnvConfig } from '../../config/env.config'
import { AppLogger } from '../../config/log.config'
import { PDFChatbot } from './loader'
import { ChainValues } from 'langchain/schema'

export class CoreLangchain {
  log = new AppLogger(CoreLangchain.name)

  async createAnswer(question: string): Promise<ChainValues | undefined> {
    try {
      const saveDirectory = '../../../vector-stores'

      const chatbot = new PDFChatbot(saveDirectory)
      chatbot.ingestDocs().catch((err) => console.error(err))

      // const llmA = new OpenAI({ modelName: 'gpt-3.5-turbo-instruct', openAIApiKey: EnvConfig.openApiKey })

      const model = new ChatGoogleGenerativeAI({
        // modelName: 'gemini-pro',
        modelName: 'gemini-1.5-pro-latest',
        maxOutputTokens: 2048
      })

      const chain = loadQAStuffChain(model)
      const directory = EnvConfig.vectorStoreDir

      const loadedVectorStore = await FaissStore.load(
        directory,
        // new OpenAIEmbeddings({ openAIApiKey: EnvConfig.openApiKey })
        new GoogleGenerativeAIEmbeddings({
          modelName: 'models/embedding-001',
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: 'Document title'
        })
      )

      const result = await loadedVectorStore.similaritySearch(question, 1)

      console.debug('PREPARING....')
      const answer = await chain.invoke({
        input_documents: result,
        question
      })
      return answer
    } catch (error) {
      this.log.error(error)
      return
    }
  }
}
