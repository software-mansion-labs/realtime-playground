import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Rocket, RotateCcw } from 'lucide-react'

export type TestCaseHandle = {
  handleRun: () => Promise<void>
  prepare: () => void
}

export type Status = 'Running' | 'Passed' | 'Failed' | null

export const statusVariant = (status: Status) => {
  if (status == 'Running') return 'outline'
  if (status == 'Failed') return 'destructive'
  if (status == 'Passed') return 'default'
}

export type StatusBadgeProps = {
  status: Status
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return <></>
  return <Badge variant={statusVariant(status)}>{status}</Badge>
}

export type RunButtonProps = {
  status: Status
  onClick: () => void
}

export const RunButton = ({ status, onClick }: RunButtonProps) => {
  if (status === 'Running') return <></>
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onClick}>
            {!status ? <Rocket /> : <RotateCcw />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{!status ? 'Run' : 'Rerun'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
