import broadcastExtension from './broadcast-extension'
import presenceExtension from './presence-extension'
import authorizationCheck from './authorization-check'
import broadcastChanges from './broadcast-changes'
import postgresChangesExtension from './postgres-changes-extension'
import { TestSuite } from '..'
import connection from './connection'

export const testCases: TestSuite = {
  ...connection,
  ...broadcastExtension,
  ...presenceExtension,
  ...authorizationCheck,
  ...broadcastChanges,
  ...postgresChangesExtension,
}
