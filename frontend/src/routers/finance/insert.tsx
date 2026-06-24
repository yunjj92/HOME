import { createFileRoute } from '@tanstack/react-router'
import { FinanceDataInsertView } from '../../views/finance/FinanceDataInsertView'

export const Route = createFileRoute('/finance/insert')({
  component: FinanceDataInsertView,
})
