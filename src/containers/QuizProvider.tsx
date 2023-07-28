import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { quizData } from '../data/quizData'
import { sendGoal } from '../utils/send-goal'

declare global {
  interface Window {
    ym: (id: number, event: string, name: string, params?: unknown) => void
  }
}

interface Question {
  id: string
}

interface InitialValues {
  currentQuestion: Question
  handleNextQuestion: () => void
  startFromTheBeginning: () => void
  isBeenRated: boolean
  setIsBeenRated: React.Dispatch<React.SetStateAction<boolean>>
  isStartModal: boolean
  setIsStartModal: React.Dispatch<React.SetStateAction<boolean>>
  calculation: { [x: string]: number }
  setCalculationByName: (name: string, value: number) => void
  handlePrevious: () => void
}

const initial: InitialValues = {
  currentQuestion: quizData[0],
  handleNextQuestion: () => undefined,
  startFromTheBeginning: () => undefined,
  isBeenRated: false,
  setIsBeenRated: () => undefined,
  isStartModal: true,
  setIsStartModal: () => undefined,
  handlePrevious: () => undefined,
  calculation: {},
  setCalculationByName: () => undefined,
}

const QuizContext = createContext<InitialValues>(initial)
const initialCalc = {
  cigarette: 119,
  cigarettePacksInDay: 0.5,
  lightersMonthly: 1,
  lighter: 25,
  default: 119 * 0.5 * 30 + 1 * 25,
}

export const QuizProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const index = useRef(0)
  const intervalId = useRef<number | undefined>(undefined)
  const seconds = useRef(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question>(quizData[0])
  const [isBeenRated, setIsBeenRated] = useState(false)
  const [isStartModal, setIsStartModal] = useState(true)

  const [startTime, setStartTime] = useState<Date | null>(null)
  const [calculation, setCalculation] = useState<{ [x: string]: number }>({
    ...initialCalc,
  })

  const calculateTimePassedAndReset = () => {
    if (startTime) {
      setStartTime(null)
      setStartTime(new Date())
    }
  }

  const handleNextQuestion = () => {
    index.current += 1
    const question = quizData[index.current]

    if (index.current === quizData.length - 1) {
      sendGoal('quizEnd')
      sendGoal('gameTime', { 'Время игры': seconds.current })
      clearInterval(intervalId.current)
      seconds.current = 0
    }
    setCurrentQuestion({ ...question })
  }

  const handlePrevious = () => {
    if (index.current === 0) return

    if (index.current === 1) {
      setCalculation({ ...initialCalc })
    }

    index.current -= 1
    setCurrentQuestion({ ...quizData[index.current] })
  }

  const startFromTheBeginning = async () => {
    index.current = 0
    setCurrentQuestion({ ...quizData[index.current] })

    calculateTimePassedAndReset()
    setIsStartModal(true)
  }

  const setCalculationByName = (name: string, value: number) => {
    setCalculation((prev) => {
      const newObject = {
        ...prev,
        [name]: value,
      }

      return {
        ...newObject,
        total:
          newObject.cigarette * newObject.cigarettePacksInDay * 30 +
          newObject.lightersMonthly * newObject.lighter,
      }
    })
  }

  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault()

      sendGoal('lastStep', {
        'Последний шаг': {
          [`Шаг ${index.current + 1}`]: index.current + 1,
        },
      })

      return (ev.returnValue = '')
    })
  }, [])

  useEffect(() => {
    setStartTime(new Date())
  }, [])

  useEffect(() => {
    if (!isStartModal) {
      const interval = setInterval(() => {
        seconds.current += 1
      }, 1000)
      intervalId.current = interval
    }
  }, [isStartModal])

  const values: InitialValues = {
    currentQuestion,
    handleNextQuestion,
    startFromTheBeginning,
    isBeenRated,
    setIsBeenRated,
    isStartModal,
    setIsStartModal,
    handlePrevious,
    calculation,
    setCalculationByName,
  }

  return <QuizContext.Provider value={values}>{children}</QuizContext.Provider>
}

export const useQuizContext = (): InitialValues => useContext(QuizContext)
