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
					if (this.state.currentPeriodLength == 0) {
						this.playAlarm();
					}
				} else if (this.state.currentPeriodLength <= 0 && !this.state.onBreak) {
					//this.playAlarm();
					this.setState(prevState => ({
						currentPeriodLength: prevState.breakLength,
						onBreak: true
					}))
				} else if (this.state.currentPeriodLength <= 0 && this.state.onBreak) {
					//this.playAlarm();
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
		document.getElementById('beep').pause();
		document.getElementById('beep').fastSeek(0);

	}

	playAlarm = () => {
		document.getElementById('beep').play();
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
				<div className="col-sm-3"></div>
				<div className="col-sm-6">
					<div className="row h-1" id="title">Pomodoro Clock</div>
					<div className="row h-2">
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
					<div className="row h-1">
						<PlayButton onClick={this.handlePlayPauseClick}/>
						<ResetButton onClick={this.handleResetClick}/>
					</div>
				</div>
				<div className="col-sm-3"></div>
			</div>
		</div>
		);
	}
}

const BreakComponent = (props) => {
	return (
		<div className="col-sm-6">
			<div className="row h-50" id="break-label">Break Length</div>
			<div className="row h-50 break-btns">
				<button type="button" className="btn btn-warning" id="break-decrement" onClick={props.decrement}><i className="fas fa-angle-down"></i></button>
				<div id="break-length">{props.time}</div>
				<button type="button" className="btn btn-warning" id="break-increment" onClick={props.increment}><i className="fas fa-angle-up"></i></button>
			</div>
		</div>
	);
}

const SessionComponent = (props) => {
	return (
		<div className="col-sm-6">
			<div className="row h-50" id="session-label">Session Length</div>
			<div className="row h-50 session-btns">
				<button type="button" className="btn btn-warning" id="session-decrement" onClick={props.decrement}><i className="fas fa-angle-down"></i></button>
				<div id="session-length">{props.time}</div>
				<button type="button" className="btn btn-warning" id="session-increment" onClick={props.increment}><i className="fas fa-angle-up"></i></button>
			</div>
		</div>
	);
}

const ClockComponent = (props) => {
	return (
		<div className="row h-5">
			<div className="col-sm-2"></div>
			<div className="col-sm-8 rounded-circle clock">
				<div className="d-flex flex-column h-50" id="timer-label">{props.onBreak ? "Break" : "Session"}</div>
				<br/>
				<div className="d-flex flex-column h-50" id="time-left">{props.time}</div>
			</div>
			<div className="col-sm-2"></div>
		</div>
	);
}

const PlayButton = (props) => {
	return (
		<div className="col-sm-6 btn-container">
			<button type="button" className="btn btn-warning btn-lg" id="start_stop" onClick={props.onClick}><i className="fas fa-play"></i><i className="fas fa-pause"></i></button>
		</div>
	);
}

const ResetButton = (props) => {
	return (
		<div className="col-sm-6 btn-container">
			<button type="button" className="btn btn-warning btn-lg" id="reset" onClick={props.onClick}><i className="fas fa-sync-alt"></i></button>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'));