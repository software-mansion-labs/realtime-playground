export type Status = 'Running' | 'Passed' | 'Failed' | null

export type TestRunnerHandle = {
  handleRun: () => Promise<'Passed' | 'Failed'>
  prepare: () => void
}

export function statusVariant(status: Status): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Passed':
      return 'default'
    case 'Failed':
      return 'destructive'
    case 'Running':
      return 'secondary'
    default:
      return 'outline'
  }
}
