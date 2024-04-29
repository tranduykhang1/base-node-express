import { ChainValues } from 'langchain/schema'
import { CoreLangchain } from '../../langchain/core'

export class DefaultService {
  async genAnswer(question: string): Promise<ChainValues | undefined> {
      const coreLangChain = new CoreLangchain()
      return await coreLangChain.createAnswer(question)
  }
}
