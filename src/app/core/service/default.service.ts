import { ChainValues } from 'langchain/schema'
import { CoreLangchain } from '../../langchain/core'
import { Soroban } from '../../soroban'

export class DefaultService {
  async genAnswer(question: string): Promise<ChainValues | undefined> {
    const coreLangChain = new CoreLangchain()
    return await coreLangChain.createAnswer(question)
    // return await coreLangChain.withEls(question)
  }

  async createHash(doc_name: string): Promise<void> {
    await new Soroban().createHash(doc_name)
  }
}
