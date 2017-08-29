/*
  tslint:disable-no-any, tslint-disable react/prefer-stateless-function, react/tsx-boolean-value,
  no-undef, tsx-a11y/label-has-for, react/no-unused-expression
*/

import * as React from 'react';
import { TextArea } from 'semantic-ui-react';
import './App.css';

export class TimerDashboard extends React.Component {
  render() {
    return (
      <div>
            <EditableTimerList /> 
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  state = { 
    timerText: ''
  };
  handleTimerText = (elapsedTime: number) => {
    const text = 'The patient took ' + elapsedTime + ' seconds to complete the 10 meter course';
    this.setState({ timerText: text });
  }
  render() {
    return (
      <div id="timers">
        <Timer
          title="Walk Timer"
          project="Dr. Strangelove"
          elapsed="0000000"
          onStopClick={this.handleTimerText}         
        />
        <div className="ui horizontal divider">Results</div>
        <TextArea 
          value={this.state.timerText}
          rows="3"
          style={{ minHeight: 100, minWidth: 400}}     
        />> 
      </div>
    );
  }
}

interface Props {
    title: string;
    project: string;
    elapsed: string;
    // tslint:disable-next-line:no-any
    onStopClick: any;
}

interface State {
    timerIsRunning: boolean;
    elapsed: number;
    runningSince: number;
     // tslint:disable-next-line:no-any
    timerToken: any;
}

class Timer extends React.Component<Props, State> {
  state = {
    timerIsRunning: false,
    elapsed: 0,
    runningSince: 0,
    timerToken: 0
  };  
  componentDidMount() {
    this.setState({ timerToken: setInterval(
       () => this.forceUpdate(), 
       50)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.timerToken);
  }
  handleStartClick = () => {
    this.setState({ 
      timerIsRunning: true,
      runningSince: Date.now()
    });
  }
  handleStopClick = () => {
    const elapsedString = renderElapsedString(
      this.state.elapsed, 
      this.state.runningSince
    );
    this.props.onStopClick(elapsedString);
    this.setState({ 
      timerIsRunning: false,
      runningSince: 0
    });
  }
  render() {
    const elapsedString = renderElapsedString(
      this.state.elapsed, 
      this.state.runningSince
    );
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="header">
            {this.props.title}
          </div>
          <div className="meta">
            {this.props.project}
          </div>
          <div className="center aligned description">
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className="extra content">
            <span className="right floated edit icon">
              <i className="edit icon" />
            </span>
            <span className="right floated trash icon">
              <i className="trash icon" />
            </span>
          </div>
        </div>
        <TimerActionButton
          timerIsRunning={this.state.timerIsRunning}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
      </div>
    );
  }
}

interface Propsx {
  timerIsRunning: boolean;
  // tslint:disable-next-line:no-any
  onStopClick: any;
  // tslint:disable-next-line:no-any
  onStartClick: any;
}

class TimerActionButton extends React.Component<Propsx> {
  render() {
    if (this.props.timerIsRunning) {
      return (
        <div
          className="ui bottom attached red basic button"
          onClick={this.props.onStopClick}
        >
          Stop
        </div>
      );
    } else {
      return (
        <div
          className="ui bottom attached green basic button"
          onClick={this.props.onStartClick}
        >
          Start
        </div>
      );
    }
  }
}

function renderElapsedString(elapsed: number, runningSince: number) {
  let totalElapsed = elapsed;
  if (runningSince) {
    totalElapsed += Date.now() - runningSince;
  }
  return millisecondsToHuman(totalElapsed);
}

function millisecondsToHuman(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(':');

  return humanized;
}

function pad(numberString: string, size: number) {
  let padded = numberString;
  while (padded.length < size) {
    padded = `0${padded}`;
  } 
  return padded;
}

export default TimerDashboard;
