import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import _ from 'lodash'

import { quizData } from '../data/quizData'

interface Answer {
  id: string
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  text: string
  isTrue?: boolean
  wrongText?: string
  subWrongText?: string
}

interface Question {
  id: string
  question: string
  rightAnswer?: RightAnswer
  answers: Answer[]
}

export type RightAnswer = {
  title: string
  whiteText?: string
  whiteSubText?: string
  importantSubText?: string
  unimportantSubText?: string[]
}

interface InitialValues {
  currentQuestion: Question
  handleNextQuestion: () => void
  isWrongTheme: boolean
  setIsWrongTheme: React.Dispatch<React.SetStateAction<boolean>>
  isRightTheme: boolean
  setIsRightTheme: React.Dispatch<React.SetStateAction<boolean>>
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
  isWrongTheme: false,
  setIsWrongTheme: () => undefined,
  isRightTheme: false,
  setIsRightTheme: () => undefined,
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

export const QuizProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const initialCalc = {
    cigarette: 119,
    cigarettePacksInDay: 0.5,
    lightersMonthly: 1,
    lighter: 38,
    default: 119 * 0.5 * 30 + 1 * 25,
  }
  const index = useRef(0)

  const [currentQuestion, setCurrentQuestion] = useState<Question>(quizData[0])
  const [isWrongTheme, setIsWrongTheme] = useState(false)
  const [isRightTheme, setIsRightTheme] = useState(false)
  const [isBeenRated, setIsBeenRated] = useState(false)
  const [isStartModal, setIsStartModal] = useState(true)

  const [startTime, setStartTime] = useState<Date | null>(null)
  const [calculation, setCalculation] = useState<{ [x: string]: number }>({
    ...initialCalc,
  })

  const calculateTimePassedAndReset = () => {
    // const endTime = new Date()

    if (startTime) {
      // const difference = differenceInSeconds(endTime, startTime)
      // const formattedTime = convertSecondsToTime(difference.toString())
      setStartTime(null)
      setStartTime(new Date())
    }
  }

  const handleNextQuestion = () => {
    index.current += 1
    setCurrentQuestion(_.cloneDeep(quizData[index.current]))
    setIsRightTheme(false)
    setIsWrongTheme(false)
  }

  const handlePrevious = () => {
    if (index.current === 0) return

    if (index.current === 1) {
      setCalculation({ ...initialCalc })
    }

    index.current -= 1
    setCurrentQuestion(_.cloneDeep(quizData[index.current]))
    setIsRightTheme(false)
    setIsWrongTheme(false)
  }

  const startFromTheBeginning = async () => {
    index.current = 0
    setCurrentQuestion(_.cloneDeep(quizData[index.current]))

    calculateTimePassedAndReset()

    setIsRightTheme(false)
    setIsWrongTheme(false)
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
    setStartTime(new Date())
  }, [])

  const values: InitialValues = {
    currentQuestion,
    handleNextQuestion,
    isWrongTheme,
    setIsWrongTheme,
    isRightTheme,
    setIsRightTheme,
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
