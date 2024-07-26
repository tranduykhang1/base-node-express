import { DecodedIdToken } from 'firebase-admin/auth'
import * as serviceAccount from '../../../secrets/firebase.json'
import * as firebase from 'firebase-admin'
import { FirebaseAuthDto } from '../dto/auth.dto'
import { AppLogger } from '../../../config/log.config'

class FirebaseLib {
  #log = new AppLogger(FirebaseLib.name)
  connect() {
    try {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount)
      })

      this.#log.info('✨ Firebase Admin SDK connected successfully.')
    } catch (_) {
      this.#log.info('Firebase Admin SDK failed to connect.')
    }
  }

  async authenticate({ token }: FirebaseAuthDto): Promise<DecodedIdToken> {
    return await firebase.auth().verifyIdToken(token)
  }
}

export const firebaseLib = new FirebaseLib()
