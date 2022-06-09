const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const allClearButton = document.querySelector('[data-all-clear]')
const clearButton = document.querySelector('[data-clear]')
const deleteButton = document.querySelector('[data-delete]')
const percentButton = document.querySelector('[data-operation-percent]')
const clearHistoryButton = document.querySelector('[data-clear-history]')
const operationSpecialButton = document.querySelectorAll(
  '[data-operation-special]'
)
const previousOperandTextElement = document.querySelector(
  '[data-previous-operand]'
)
const currentOperandTextElement = document.querySelector(
  '[data-current-operand]'
)
const calculationResultList = document.querySelector(
  '[data-calculation-result-list]'
)
const calculationResultListItem = document.querySelectorAll(
  '[data-result-list-item]'
)
const resutlListResult = document.querySelectorAll('[data-result-list-result]')

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }
  resultArray = []

  clear() {
    this.currentOperand = ''
    previousOperandTextElement.innerText = ''
    this.previousOperand = ''
    this.operation = undefined
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }
  storeCalculation(computation) {
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    const operation = this.operation
    if (isNaN(prev) || isNaN(current)) return
    const calculation = `${prev} ${operation} ${current}`
    const result = computation
    this.resultArray.push({ calculation, result })
    calculationResultList.insertAdjacentHTML(
      'afterbegin',
      `<li class="result-list" data-result-list-item>${calculation}  = <span class="result-list-result" data-result-list-result> ${result}</li></span>`
    )
    console.log(this.resultArray)
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }
  chooseSpecialOperation(operation) {
    if (this.currentOperand === '') return
    this.computeSpecial()
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = this.currentOperand
  }
  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return

    switch (this.operation) {
      case '+':
        computation = prev + current
        this.storeCalculation(computation)
        break
      case '-':
        computation = prev - current
        this.storeCalculation(computation)
        break
      case '×':
        computation = prev * current
        this.storeCalculation(computation)
        break
      case '÷':
        computation = prev / current
        this.storeCalculation(computation)
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

  computeSpecial() {
    let computation
    const current = parseFloat(this.currentOperand)
    if (isNaN(current)) return
    switch (this.operation) {
      case '√':
        computation = Math.sqrt(current)
        calculator.storeCalculation(computation)
        break
      case 'x2':
        computation = Math.pow(current, 2)
        calculator.storeCalculation(computation)
        break
      case '1/x':
        computation = 1 / current
        calculator.storeCalculation(computation)
        break
      case '+/-':
        computation = -current
        calculator.storeCalculation(computation)
        break
      case '%':
        computation = current / 100
        calculator.storeCalculation(computation)
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

  updateDisplay() {
    this.previousOperandTextElement.innerText = this.formatDisplayNumber(
      this.previousOperand
    )
    this.currentOperandTextElement.innerText = this.formatDisplayNumber(
      this.currentOperand
    )
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.formatDisplayNumber(
        this.previousOperand
      )} ${this.operation}`
    }
  }
  updateDisplayPercent() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    computation = prev * (current / 100)
    this.currentOperand = computation
  }

  formatDisplayNumber(number) {
    const currentNumber = number.toString()
    const integerDigits = parseFloat(currentNumber.split('.')[0])
    const decimalDigits = currentNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }
}
const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
)

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})
operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
    calculator.storeCalculation()
  })
})
allClearButton.addEventListener('click', () => {
  calculator.clear()

  calculator.updateDisplay()
})
clearButton.addEventListener('click', () => {
  calculator.currentOperand = ''
  calculator.updateDisplay()
})
clearHistoryButton.addEventListener('click', () => {
  calculationResultList.innerHTML = ''
})
deleteButton.addEventListener('click', () => {
  calculator.delete()
  calculator.updateDisplay()
})
operationSpecialButton.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseSpecialOperation(button.innerText)
    calculator.computeSpecial()
    calculator.storeCalculation()
    calculator.updateDisplay()
  })
})
percentButton.addEventListener('click', () => {
  calculator.updateDisplayPercent()
  calculator.updateDisplay()
})
equalsButton.addEventListener('click', () => {
  calculator.compute()
  calculator.storeCalculation()
  calculator.updateDisplay()
})
calculationResultList.addEventListener('click', (e) => {
  if (e.target.nodeName === 'LI') {
    const result = e.target.childNodes[1].innerText
    calculator.currentOperand = result
    calculator.updateDisplay()
  } else if (e.target.nodeName === 'SPAN') {
    const result = e.target.innerText
    calculator.currentOperand = result
    calculator.updateDisplay()
  }
})

// ============================================
// Keyborad support
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    calculator.compute()
    calculator.storeCalculation()
    calculator.updateDisplay()
  }
  if (e.key === 'Backspace') {
    calculator.delete()
    calculator.updateDisplay()
  }
  if (e.key === 'Escape') {
    calculator.clear()
    calculator.updateDisplay()
  }
  if (e.key === '+') {
    calculator.chooseOperation('+')
    calculator.updateDisplay()
  }
  if (e.key === '-') {
    calculator.chooseOperation('-')
    calculator.updateDisplay()
  }
  if (e.key === '*') {
    calculator.chooseOperation('&times;')
    calculator.updateDisplay()
  }
  if (e.key === '/') {
    calculator.chooseOperation('÷')
    calculator.updateDisplay()
  }
  if (e.key === '.') {
    calculator.appendNumber('.')
    calculator.updateDisplay()
  }
  if (e.key === '0') {
    calculator.appendNumber('0')
    calculator.updateDisplay()
  }
  if (e.key === '1') {
    calculator.appendNumber('1')
    calculator.updateDisplay()
  }
  if (e.key === '2') {
    calculator.appendNumber('2')
    calculator.updateDisplay()
  }
  if (e.key === '3') {
    calculator.appendNumber('3')
    calculator.updateDisplay()
  }
  if (e.key === '4') {
    calculator.appendNumber('4')
    calculator.updateDisplay()
  }
  if (e.key === '5') {
    calculator.appendNumber('5')
    calculator.updateDisplay()
  }
  if (e.key === '6') {
    calculator.appendNumber('6')
    calculator.updateDisplay()
  }
  if (e.key === '7') {
    calculator.appendNumber('7')
    calculator.updateDisplay()
  }
  if (e.key === '8') {
    calculator.appendNumber('8')
    calculator.updateDisplay()
  }
  if (e.key === '9') {
    calculator.appendNumber('9')
    calculator.updateDisplay()
  }
})
