import React, { ChangeEvent } from 'react'
import CurrencyInput from 'react-currency-input-field'

import { useQuizContext } from '../../containers/QuizProvider'

CurrencyInput

import styles from './input.module.scss'

interface CustomInputProps {
  label: string
  placeholder?: string
  disabled?: boolean
  name: string
  min: number
}

export const Input: React.FC<CustomInputProps> = ({ label, min, name }) => {
  const { setCalculationByName } = useQuizContext()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    const digitsOnly = inputValue.replace(/\D/g, '')

    const calculate = Number(digitsOnly) <= min ? min : Number(digitsOnly)

    setCalculationByName(name, calculate)
  }

  return (
    <div className={styles.container}>
      <label className={styles.title}>{label}</label>
      <div className={styles.inputComponent}>
        <CurrencyInput
          suffix=" ₽"
          onChange={handleChange}
          placeholder="Введите сумму"
        />
      </div>
    </div>
  )
}
