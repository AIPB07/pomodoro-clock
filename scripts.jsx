// Default session and break lengths
const defaultBreakLength = 300000; // 5 minutes
const defaultSessionLength = 1500000; // 25 minutes

// Default state
const defaultState = {
	breakLength: defaultBreakLength,
	sessionLength: defaultSessionLength,
	currentPeriodLength: defaultSessionLength,
	isPaused: true,
	onBreak: false
}

// Function for displaying a time in ms as 'mm:ss'
const displayCurrentTime = (time) => {
	let minutes = Math.floor(time / 60000);
	let seconds = Math.floor((time % 60000) / 1000);
	return (minutes.toLocaleString("en-GB", {minimumIntegerDigits: 2}) + 
			":" + seconds.toLocaleString("en-GB", {minimumIntegerDigits: 2}));
}

// Main stateful component
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = defaultState
	}

	runTimer = () => {
		let timer = setInterval(() => {
			if (!this.state.isPaused) {
				if (this.state.currentPeriodLength > 0) {
					this.setState(prevState => ({currentPeriodLength: prevState.currentPeriodLength - 1000}))
				} else if (this.state.currentPeriodLength <= 0 && !this.state.onBreak) {
					this.playAlarm();
					this.setState(prevState => ({
						currentPeriodLength: prevState.breakLength,
						onBreak: true
					}))
				} else if (this.state.currentPeriodLength <= 0 && this.state.onBreak) {
					this.playAlarm();
					this.setState(prevState => ({
						currentPeriodLength: prevState.sessionLength,
						onBreak: false
					}))
				}
			}
		}, 1000)
	}

	handlePlayPauseClick = () => {
		this.setState (prevState => ({isPaused: !prevState.isPaused}));
	}

	handleResetClick = () => {
		this.setState (defaultState);
	}

	playAlarm = () => {
		document.getElementById('alarm').play();
	}

	breakIncrement = () => {
		if (this.state.isPaused && this.state.breakLength < 3600000) {
			this.setState(prevState => ({breakLength: prevState.breakLength + 60000}))
			if (this.state.onBreak) {
				this.setState(prevState => ({currentPeriodLength: prevState.breakLength}))
			}
		}
	}

	breakDecrement = () => {
		if (this.state.isPaused && this.state.breakLength > 60000) {
			this.setState(prevState => ({breakLength: prevState.breakLength - 60000}))
			if (this.state.onBreak) {
				this.setState(prevState => ({currentPeriodLength: prevState.breakLength}))
			}
		}
	}

	sessionIncrement = () => {
		if (this.state.isPaused && this.state.sessionLength < 3600000) {
			this.setState(prevState => ({sessionLength: prevState.sessionLength + 60000}))
			if (!this.state.onBreak) {
				this.setState(prevState => ({currentPeriodLength: prevState.sessionLength}))
			}
		}
	}

	sessionDecrement = () => {
		if (this.state.isPaused && this.state.sessionLength > 60000) {
			this.setState(prevState => ({sessionLength: prevState.sessionLength - 60000}))
			if (!this.state.onBreak) {
				this.setState(prevState => ({currentPeriodLength: prevState.sessionLength}))
			}
		}
	}

	componentDidMount = () => {
		this.runTimer();
	}

	render() {
		return (
		<div className="container-fluid h-100">
			<div className="row h-100">
				<div className="col-sm-3 border"></div>
				<div className="col-sm-6 border">
					<div className="row h-1 border">Pomodoro Clock</div>
					<div className="row h-2 border">
						<BreakComponent 
							time={this.state.breakLength/60000}
							increment={this.breakIncrement}
							decrement={this.breakDecrement}/>
						<SessionComponent 
							time={this.state.sessionLength/60000}
							increment={this.sessionIncrement}
							decrement={this.sessionDecrement}/>
					</div>
					<ClockComponent 
						time={displayCurrentTime(this.state.currentPeriodLength)}
						onBreak={this.state.onBreak}/>
					<div className="row h-1 border">
						<PlayButton onClick={this.handlePlayPauseClick}/>
						<ResetButton onClick={this.handleResetClick}/>
					</div>
				</div>
				<div className="col-sm-3 border"></div>
			</div>
		</div>
		);
	}
}

const BreakComponent = (props) => {
	return (
		<div className="col-sm-6 border">
			<div className="row h-50 border" id="break-label">Break Length</div>
			<div className="row h-50 border">
				<button type="button" className="btn btn-primary" id="break-decrement" onClick={props.decrement}>-</button>
				<div>{props.time}</div>
				<button type="button" className="btn btn-primary" id="break-increment" onClick={props.increment}>+</button>
			</div>
		</div>
	);
}

const SessionComponent = (props) => {
	return (
		<div className="col-sm-6 border">
			<div className="row h-50 border" id="session-label">Session Length</div>
			<div className="row h-50 border">
				<button type="button" className="btn btn-primary" id="session-decrement" onClick={props.decrement}>-</button>
				<div>{props.time}</div>
				<button type="button" className="btn btn-primary" id="session-increment" onClick={props.increment}>+</button>
			</div>
		</div>
	);
}

const ClockComponent = (props) => {
	return (
		<div className="row h-5 border">
			<div className="col-sm-2 border"></div>
			<div className="col-sm-8 border rounded-circle clock">
				<div className="d-flex flex-column h-50" id="timer-label">{props.onBreak ? "Break" : "Session"}</div>
				<br/>
				<div className="d-flex flex-column h-50" id="time-left">{props.time}</div>
			</div>
			<div className="col-sm-2 border"></div>
		</div>
	);
}

const PlayButton = (props) => {
	return (
		<div className="col-sm-6 border">
			<button type="button" className="btn btn-primary" id="start_stop" onClick={props.onClick}>Play/Pause</button>
		</div>
	);
}

const ResetButton = (props) => {
	return (
		<div className="col-sm-6 border">
			<button type="button" className="btn btn-primary" id="reset" onClick={props.onClick}>Reset</button>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'));