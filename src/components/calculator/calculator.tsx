import { Input } from '../../ui/input/input'
import { Slider } from '../../ui/slider/slider'
import st from './calculator.module.scss'

export const Calculator = () => {
  return (
    <div className={st.calculator}>
      <Input
        label={'Сколько стоят сигареты, которые вы курите?'}
        name={'cigarette'}
        min={119}
      />
      <Slider
        title={'Количество пачек в день'}
        labels={['0,5', '1', '1.5', '2', '2.5', '3']}
        symbol={['пачки', 'пачка', 'пачки', 'пачки', 'пачки', 'пачки']}
        min={0.5}
        max={3}
        step={0.5}
        name={'cigarettePacksInDay'}
      />
      <Slider
        title={'Сколько примерно зажигалок вы покупаете  в месяц?'}
        labels={['1', '2', '3', '4']}
        symbol={['зажигалка', 'зажигалки', 'зажигалки', 'зажигалки']}
        min={1}
        max={4}
        step={1}
        name={'lightersMonthly'}
      />
      <Input
        label={'Сколько стоят зажигалки, которые вы используете?'}
        name={'lighter'}
        min={25}
      />
    </div>
  )
}
