import { TaskType } from '@google/generative-ai'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { AppLogger } from '../../config/log.config'

import { Document } from '@langchain/core/documents'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import path from 'path'

export class PDFChatbot {
  private saveDirectory: string
  private chunkSize: number
  private chunkOverlap: number
  log = new AppLogger(PDFChatbot.name)

  constructor(saveDirectory: string, chunkSize: number = 500, chunkOverlap: number = 50) {
    this.saveDirectory = saveDirectory
    this.chunkSize = chunkSize
    this.chunkOverlap = chunkOverlap
  }

  public async ingestDocs(): Promise<void> {
    const directoryLoader = new PDFLoader(path.join(__dirname, './files/c-handbook.pdf'))
    const docs = await directoryLoader.load()

    this.log.info('Docs loaded')

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap
    })

    const docOutput = await textSplitter.splitDocuments(docs)

    // new OpenAIEmbeddings({ openAIApiKey: EnvConfig.openApiKey })
    const vectorStore = await FaissStore.fromDocuments(
      docOutput,
      new GoogleGenerativeAIEmbeddings({
        modelName: 'models/embedding-001',
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: 'Document title'
      })
    )
    this.log.info('Saving...')

    await vectorStore.save(this.saveDirectory)

    this.log.info('Saved!')
  }

  public async textFromPdf(): Promise<Document<Record<string, unknown>>[]> {
    const directoryLoader = new PDFLoader(path.join(__dirname, './files/test.pdf'))
    const docs = await directoryLoader.load()

    this.log.info('Docs loaded')

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap
    })

    const docOutput = await textSplitter.splitDocuments(docs)

    return docOutput as Document<Record<string, unknown>>[]
  }
}
