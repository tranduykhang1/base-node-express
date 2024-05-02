import { BASE_FEE, Contract, Keypair, Networks, SorobanRpc, TransactionBuilder, xdr } from '@stellar/stellar-sdk'
import 'dotenv/config'
import envConfig from '../../config/env.config'

const rpcUrl = 'https://soroban-testnet.stellar.org'

const params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET
}

export class SmartContractInteraction {
  async invoke(contractName: string, args: xdr.ScVal[]): Promise<xdr.ScVal | unknown> {
    const kp = Keypair.fromSecret(envConfig.get('accountSecret')),
      caller = kp.publicKey(),
      provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true }),
      sourceAccount = await provider.getAccount(caller),
      contract = new Contract(envConfig.get('contractAddress')),
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(contractName, ...args))
        .setTimeout(30)
        .build()
    const prepareTx = await provider.prepareTransaction(buildTx)
    prepareTx.sign(kp)
    try {
      const sendTx = await provider.sendTransaction(prepareTx).catch(function (err) {
        return err
      })
      if (sendTx.errorResult) {
        throw new Error('Unable to submit transaction')
      }
      if (sendTx.status === 'PENDING') {
        let txResponse = await provider.getTransaction(sendTx.hash)
        while (txResponse.status === 'NOT_FOUND') {
          txResponse = await provider.getTransaction(sendTx.hash)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
        if (txResponse.status === 'SUCCESS') {
          const result = txResponse.returnValue
          return result
        }
      }
    } catch (err) {
      return err
    }
  }
}
