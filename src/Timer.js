import React from 'react';
import Sound from './sound_fx/lofi.mp3'

export default class Relogio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minInput: '00',
      secInput: '00',
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
      started: false,
      parado: true,
      reinicio: false,
      retomar: false,
      zerar: false,
    }

    this.Sound = new Audio(Sound);
  }

  timerLogica = (minutos, segundos, milesegundos = 1000) => {
    const time = new Date(0)
    time.setHours(0);
    time.setMinutes(minutos)
    time.setSeconds(segundos)
    time.setMilliseconds(milesegundos)

    this.contagemRegressiva = setInterval(() => {
      time.setMilliseconds(time.getMilliseconds() - 4)
      const min = time.toTimeString().slice(3, 5);
      const sec = time.toTimeString().slice(6, 8);
      const timeString = `${min}:${sec}`
      this.setState({
        minutes: min,
        seconds: sec,
        milliseconds: `${time.getMilliseconds()}`,
      })
      if (timeString === '00:00') {
        clearInterval(this.contagemRegressiva)
        this.setState({
          time: `00:00`,
          milliseconds: `000`,
          parado: true,
          retomar: false,
          reinicio: true,
          zerar: false,
        })
      }
    }, 1)
  }

  iniciar = () => {
    const { minInput, secInput, milliseconds } = this.state;
    if(minInput+secInput === '0000' ){
      return
    }
    
    this.setState({
      started: true,
      parado: false,
      reinicio: true,
      retomar: false,
      zerar: false,
    })
    this.timerLogica(minInput, secInput, milliseconds);
    this.Sound.play();
  }

  parar = () => {
    clearInterval(this.contagemRegressiva)
    this.setState({
      parado: true,
      reinicio: true,
      retomar: true,
      zerar: false,
    })
  }

  resetar = () => {
    clearInterval(this.contagemRegressiva)
    this.setState({
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
      started: false,
      parado: true,
      reinicio: false,
      retomar: false,
      zerar: true,
    })
    this.Sound.pause();
  }

  retomar = () => {
    const { minutes, seconds, milliseconds } = this.state;
    if(minutes+seconds === '0000' ){
      return
    }

    this.setState({
      started: true,
      parado: false,
      reinicio: true,
      retomar: false,
      zerar: false,
    })
    this.timerLogica(minutes, seconds, milliseconds)
  }

  reiniciar = () => {
    clearInterval(this.contagemRegressiva)
    this.setState({
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
      started: true,
      parado: false,
      reinicio: true,
      retomar: false,
      zerar: false,
    })
    const { minInput, secInput } = this.state;
    this.timerLogica(minInput, secInput, 1);
    this.Sound.pause();
  }

  zerar = () => {
    this.setState({
      minInput: '00',
      secInput: '00',
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
      started: false,
      parado: true,
      reinicio: false,
      retomar: false,
      zerar: false,
    })
  }

  onChangeInput = (event) => {
    let { value, name } = event.target;
    // so aceita numeros.
    value = value.replace(/[a-zA-Z]/g, '00')
    this.setState({ [name]: value })
    if (name === 'minutes') this.setState({ minInput: value });
    if (name === 'seconds') this.setState({ secInput: value });
  }

  onBlueInput = (e) => {
    let { value, name } = e.target;
    if (value.length === 1) { value = `0${value}` }
    if (value.length === 0) { value = `00` }
    this.setState({ [name]: value })
    if (name === 'minutes') this.setState({ minInput: value });
    if (name === 'seconds') this.setState({ secInput: value });
  }

  onFocusSelect = (e) => {
    e.target.select()
  }

  render() {
    document.title = "BeeOnTime"
    const { 
      minInput,
      secInput,
      minutes,
      seconds,
      started,
      milliseconds,
      parado,
      reinicio,
      retomar,
     zerar,
     } = this.state;

    const timer = (
      <section className="times" >
        <p className="minSecs" >{`${minutes}:${seconds}`}.</p>
        <p className="milliseconds">{milliseconds}</p>
      </section>
    )
    const inputter = (
      <section className="input-time">
        <input
        name="minutes"
          type="text"
          maxLength="2"
          value={minInput}
          placeholder="Minutos"
          onChange={this.onChangeInput}
          onFocus={this.onFocusSelect}
          onBlur={this.onBlueInput} />
        <p>:</p>
        <input
        name="seconds"
          maxLength="2"
          type="text"
          placeholder="Segundos"
          value={secInput}
          onChange={this.onChangeInput}
          onFocus={this.onFocusSelect}
          onBlur={this.onBlueInput}
        />
      </section>
    )
    const parar = (
      <p className="input-time-parar" onClick={this.parar}>Parar</p>
    )
    const iniciar = (
      <p
        className="input-time-iniciar"
        onClick={() => this.iniciar()}>Iniciar
      </p>
    )
    const reiniciar = (
      <p
        className="input-time-reiniciar"
        onClick={() => this.reiniciar()}>Reiniciar
      </p>
    )

    const retomado = (
      <p
        className="input-time-retomar"
        onClick={() => this.retomar()}>Retomar
      </p>
    )

    const zerado = (
      <p
        className="input-time-zerar"
        onClick={() => this.zerar()}>Zerar
      </p>
    )

    return (
      <>
        <section className="main-time">
          {started ? timer : inputter}
          <section className="menu-time">
            {retomar && retomado}
            {!parado && parar }
            {(!retomar && !started) && iniciar}
            {reinicio && reiniciar}
            <p className="input-time-resetar" onClick={this.resetar}>Resetar</p>
            {zerar && zerado}
          </section>
        </section>
          <footer>
            <a href="https://beedeveloper.notion.site/BeeDev-b3284d4907f8420eb3bd6021e7baeaf9" target="_blank">Portal BeeDev</a>
          </footer> 
      </>
    )
  }
} 
