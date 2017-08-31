/*
  tslint:disable-no-any, tslint-disable react/prefer-stateless-function, react/tsx-boolean-value,
  no-undef, tsx-a11y/label-has-for, react/no-unused-expression
*/

import * as React from 'react';
import './App.css';

export class TimerDashboard extends React.Component {
  render() {
    return (
      <div>
            <UIDriver /> 
      </div>
    );
  }
}

interface DriverState {
  doctor: string;
  editFormOpen: boolean;
}

class UIDriver extends React.Component<{}, DriverState> {
  state = {
    editFormOpen: false,
    doctor: 'Default Doctor'
  };

  handleEditClick = () => {
    this.openForm();
  }
  
  handleFormClose = () => {
    this.closeForm();
  }

  // tslint:disable-next-line:no-any
  handleSubmit = (doc: string) => {
    this.setState({ doctor: doc });
    this.closeForm();
  }

  closeForm = () => {
    this.setState({ editFormOpen: false });
  }

  openForm = () => {
    this.setState({ editFormOpen: true });
  }

  render() {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          title="Enter Doctor:"
          doctor={this.state.doctor}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    // Inside EditableTimer
    } else {
      return (
        <EditableTimer 
          onTimerEdit={this.openForm}
          doctor={this.state.doctor}
        />
      );
    }
  }
}

interface EditProps {
  // tslint:disable-next-line:no-any
  onTimerEdit: any;
  doctor: string;
}

interface EditState {
  editFormOpen: boolean;
  timerText: string;
}

class EditableTimer extends React.Component<EditProps, EditState> {
  state = { 
    project: '',
    editFormOpen: false,
    timerText: ''
  };

  showTimerText = (elapsedTime: number) => {
    const text = 'The patient took ' + elapsedTime + ' seconds to complete the 10 meter course';
    this.setState({ timerText: text });
  }

  clearTimerText = (elapsedTime: number) => {
    this.setState({ timerText: '' });
  } 

  render() {
    return (
      <div className="ui form">
        <Timer
          title="Walk Timer"
          doctor={this.props.doctor}
          elapsed="0000000"
          onStartClick={this.clearTimerText}         
          onStopClick={this.showTimerText}         
          onEditClick={this.props.onTimerEdit}         
        />
        <div className="ui horizontal divider">Results</div>
        <div className="ui raised very padded text container segment">
          <p>{this.state.timerText}</p>
        </div>
      </div>
    );
  }
}

interface FormProps {
  // tslint:disable-next-line:no-any
  onFormSubmit: any;  
  // tslint:disable-next-line:no-any
  onFormClose: any;
  title: string;
  doctor: string;
}

interface FormState {
  doctor: string;
  editFormOpen: boolean;
}

class TimerForm extends React.Component<FormProps, FormState> {
  state = {
    doctor: this.props.doctor || '',
    editFormOpen: false
  };
  // tslint:disable-next-line:no-any
  handleDoctorChange = (e: any) => {
    this.setState({ doctor: e.target.value });
  }
  handleSubmit = () => {
    this.props.onFormSubmit(
      this.state.doctor      
    );
  }
  render() {
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Doctor</label>
              <input
                type="text"
                value={this.state.doctor}
                onChange={this.handleDoctorChange}
              />
            </div>
            <div className="ui two bottom attached buttons">
              <button
                className="ui basic blue button"
                onClick={this.handleSubmit}
              >
                Save
              </button>
              <button
                className="ui basic red button"
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

interface TimerProps {
    title: string;
    doctor: string;
    elapsed: string;
    // tslint:disable-next-line:no-any
    onStartClick: any;
    // tslint:disable-next-line:no-any
    onStopClick: any;
    // tslint:disable-next-line:no-any
    onEditClick: any;
}

interface TimerState {
    timerIsRunning: boolean;
    elapsed: number;
    runningSince: number;
     // tslint:disable-next-line:no-any
    timerToken: any;
}

class Timer extends React.Component<TimerProps, TimerState> {
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
    this.props.onStartClick();
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
  handleEditClick = () => {
    this.props.onEditClick();
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
            {this.props.title.toString()}
          </div>
          <div className="meta">
            {this.props.doctor}
          </div>
          <div className="center aligned description">
            <h2>
              {elapsedString}
            </h2>
          </div>
        </div>
        <div className="extra content">
            <span
              className="right floated edit icon"
              onClick={this.handleEditClick}
            >
              <i className="edit icon" />
            </span>
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

interface ButtonProps {
  timerIsRunning: boolean;
  // tslint:disable-next-line:no-any
  onStopClick: any;
  // tslint:disable-next-line:no-any
  onStartClick: any;
}

class TimerActionButton extends React.Component<ButtonProps> {
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