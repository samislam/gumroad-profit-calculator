import { toNumber } from 'lodash'
import { isNumericString } from './utils'
import { input, select } from '@inquirer/prompts'
import type { PayoutMethod, SalesMethod } from './types'

const grossPrice = toNumber(
  await input({ message: 'Product gross price ($USD):', validate: isNumericString })
)
const sales = toNumber(await input({ message: 'Sales:', validate: isNumericString }))

const salesMethod = await select<SalesMethod>({
  message: 'How was the product getting sales?',
  choices: [
    { name: 'Affiliated', value: 'affiliated' },
    { name: 'Discovered', value: 'discovered' },
  ],
})

const percentOfGumroad = toNumber(
  await input({
    message: 'Enter the percentage of Gumroad:',
    validate: isNumericString,
    default: salesMethod === 'affiliated' ? '0.10' : '0.30',
  })
)

const fixedCutForGumroad = toNumber(
  await input({
    message: 'Enter the fixed cut of Gumroad:',
    validate: isNumericString,
    default: '0.50',
  })
)

const payoutMethod = await select<PayoutMethod>({
  message: 'How will you pull out your money?',
  choices: [
    { name: 'Bank-transfer', value: 'bank-transfer' },
    { name: 'Paypal', value: 'paypal' },
  ],
})

let percentOfProcessor: number
let fixedCutForProcessor: number

switch (payoutMethod) {
  case 'paypal':
    percentOfProcessor = toNumber(
      await input({
        message: 'Enter the percentage of Paypal:',
        validate: isNumericString,
        default: '0.029',
      })
    )

    fixedCutForProcessor = toNumber(
      await input({
        message: 'Enter the fixed cut of Paypal:',
        validate: isNumericString,
        default: '0.30',
      })
    )
    break
  case 'bank-transfer':
    percentOfProcessor = toNumber(
      await input({
        message: 'Enter the percentage of credit card:',
        validate: isNumericString,
        default: '0.029',
      })
    )

    fixedCutForProcessor = toNumber(
      await input({
        message: 'Enter the fixed cut of the processor:',
        validate: isNumericString,
        default: '0.30',
      })
    )
}

const income = sales * grossPrice
const gumroadShare = income * percentOfGumroad + fixedCutForGumroad
const processorShare = income * percentOfProcessor + fixedCutForProcessor
const profit = income - (gumroadShare + processorShare)

console.table({
  income: income.toFixed(1) + '$',
  gumroadShare: `${gumroadShare.toFixed(1)}$`,
  processorShare: `${processorShare.toFixed(1)}$`,
  profit: profit.toFixed(1) + '$',
})

console.log('\n', 'Islam Yamor 03-03-2025')
