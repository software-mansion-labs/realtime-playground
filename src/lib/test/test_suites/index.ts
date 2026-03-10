import broadcastExtension from './broadcast-extension'
import presenceExtension from './presence-extension'
import authorizationCheck from './authorization-check'
import broadcastChanges from './broadcast-changes'
import postgresChangesExtension from './postgres-changes-extension'
import { TestSuite } from '..'

export const testCases: TestSuite = {
  ...broadcastExtension,
  ...presenceExtension,
  ...authorizationCheck,
  ...broadcastChanges,
  ...postgresChangesExtension,
}
