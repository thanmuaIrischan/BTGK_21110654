import React, {Component} from 'react';
const formatTime = require('minutes-seconds-milliseconds');
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
interface StopwatchState {
  timeElapsed: number | null;
  running: boolean;
  startTime: Date | null;
  laps: number[];
}
export default class Stopwatch extends Component<{}, StopwatchState> {
  interval: NodeJS.Timeout | null = null;
  constructor(props: {}) {
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: [],
    };
    this.handleStartPress = this.handleStartPress.bind(this);
    this.startStopButton = this.startStopButton.bind(this);
    this.handleLapPress = this.handleLapPress.bind(this);
  }

  laps() {
    return this.state.laps.map((time, index) => (
      <View key={index} style={styles.lap}>
        <Text style={[styles.lapText, this.getLongestShortestColor(index)]}>
          Lap {index + 1}
        </Text>
        <Text style={[styles.lapText, this.getLongestShortestColor(index)]}>
          {formatTime(time)}
        </Text>
      </View>
    ));
  }

  getLongestShortestColor(index: number) {
    const maxTime = Math.max(...this.state.laps);
    const minTime = Math.min(...this.state.laps);

    if (this.state.laps[index] === maxTime) {
      return {color: 'red'};
    } else if (this.state.laps[index] === minTime) {
      return {color: 'green'};
    }

    return {};
  }

  startStopButton() {
    return (
      <TouchableHighlight
        underlayColor="gray"
        onPress={this.handleStartPress}
        style={[
          styles.button,
          this.state.running ? styles.stopButton : styles.startButton,
        ]}>
        <Text
          style={{fontSize: 20, color: this.state.running ? 'red' : '#5EA804'}}>
          {this.state.running ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
    );
  }

  lapButton() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="gray"
        onPress={this.handleLapPress}>
        <Text style={{fontSize: 20, color: 'white'}}>Lap</Text>
      </TouchableHighlight>
    );
  }

  handleLapPress() {
    if (this.state.timeElapsed !== null) {
      var lap = this.state.timeElapsed;

      this.setState({
        startTime: new Date(),
        laps: this.state.laps.concat([lap]),
      });
    }
  }

  handleStartPress() {
    if (this.state.running) {
      if (this.interval) clearInterval(this.interval);
      this.setState({
        running: false,
        timeElapsed: 0,
      });
      return;
    }

    this.setState({startTime: new Date()});

    this.interval = setInterval(() => {
      if (this.state.startTime !== null) {
        this.setState(prevState => ({
          timeElapsed: new Date().getTime() - prevState.startTime!.getTime(),
          running: true,
        }));
      }
    }, 30);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.timerWrapper}>
            <Text style={styles.timer}>
              {formatTime(this.state.timeElapsed || 0)}
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            {this.lapButton()}
            {this.startStopButton()}
          </View>
        </View>
        <View style={styles.footer}>{this.laps()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    flex: 1,
    height: 20,
  },
  footer: {
    flex: 1,
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonWrapper: {
    flex: 3,
    top: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lap: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    //padding: 10,
    marginTop: 10,
  },
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'white',
    padding: 2,
  },
  timer: {
    paddingTop: 100,
    fontSize: 100,
    color: 'white',
    paddingLeft: 20,
  },
  lapText: {
    fontSize: 20,
    color: 'white',
  },

  lapTextSecond: {
    fontSize: 20,
    color: 'white',
  },
  startButton: {
    borderColor: '#5EA804',
  },
  stopButton: {
    borderColor: 'red',
  },
});
