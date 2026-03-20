import { TableBody } from './TableBody'
import { TableCaption } from './TableCaption'
import { TableCell } from './TableCell'
import { TableFooter } from './TableFooter'
import { TableHead } from './TableHead'
import { TableHeader } from './TableHeader'
import { TableRoot } from './Table'
import { TableRow } from './TableRow'

export const Table = Object.assign(TableRoot, {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
})
