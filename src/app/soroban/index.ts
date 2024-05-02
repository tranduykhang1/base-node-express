import { nativeToScVal } from '@stellar/stellar-sdk'
import { AppLogger } from '../../config/log.config'
import { SmartContractInteraction } from './contract'

export class Soroban {
  log: AppLogger = new AppLogger(Soroban.name)
  samplePubKey = 'GAVOIOKLLSA4Q7TJIJJAGJLRF6Y6TDREFXNNM46EQA2OKVD37ZIRJNYJ'

  async createHash(doc_name: string) {
    try {
      const args = [
        nativeToScVal(this.samplePubKey, {
          type: 'address'
        }),
        nativeToScVal(doc_name, { type: 'string' }),
        nativeToScVal(123123, { type: 'i32' })
      ]

      await new SmartContractInteraction().invoke('set_document', args)
      this.log.info('Transaction invoked successfully!')
    } catch (e) {
      this.log.info(`${e}`)
    }
  }
}
