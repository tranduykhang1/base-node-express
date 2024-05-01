import { Client, ClientOptions } from '@elastic/elasticsearch'
import { TaskType } from '@google/generative-ai'
import { ElasticClientArgs, ElasticVectorSearch } from '@langchain/community/vectorstores/elasticsearch'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { VectorDBQAChain, loadQAStuffChain } from 'langchain/chains'
import { ChainValues } from 'langchain/schema'
import envConfig from '../../config/env.config'
import { AppLogger } from '../../config/log.config'
import { PDFChatbot } from './loader'

export class CoreLangchain {
  log = new AppLogger(CoreLangchain.name)

  async createAnswer(question: string): Promise<ChainValues | undefined> {
    try {
      const chatbot = new PDFChatbot(envConfig.get('vectorStoreDir'))
      await chatbot.ingestDocs()

      // const llmA = new OpenAI({ modelName: 'gpt-3.5-turbo-instruct', openAIApiKey: EnvConfig.openApiKey })

      const model = new ChatGoogleGenerativeAI({
        // modelName: 'gemini-pro',
        modelName: 'gemini-1.5-pro-latest',
        maxOutputTokens: 2048
      })

      const chain = loadQAStuffChain(model)
      const directory = envConfig.get('vectorStoreDir')

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
      return answer.text
    } catch (error) {
      this.log.error(error)
      return
    }
  }

  async withEls(question: string): Promise<ChainValues | undefined> {
    try {
      const chatbot = new PDFChatbot(envConfig.get('vectorStoreDir'))
      const docs = await chatbot.textFromPdf()

      const config: ClientOptions = {
        node: envConfig.get('elsUri') ?? 'http://localhost:9200'
      }

      const clientArgs: ElasticClientArgs = {
        client: new Client(config),
        indexName: 'test_vectorstore'
      }

      const vectorStore = await ElasticVectorSearch.fromDocuments(
        docs,
        new GoogleGenerativeAIEmbeddings({
          modelName: 'models/embedding-001',
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: 'Document title'
        }),
        clientArgs
      )

      this.log.info('Connected to ELS')

      const model = new ChatGoogleGenerativeAI({
        modelName: 'gemini-1.5-pro-latest',
        maxOutputTokens: 2048
      })

      this.log.info('Added to document')

      const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 1,
        returnSourceDocuments: true
      })

      this.log.info('Load model')

      const result = await vectorStore.similaritySearch(question, 1)

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
