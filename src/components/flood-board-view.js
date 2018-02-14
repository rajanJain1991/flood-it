import React, { Component } from 'react';
import '../style/flood-board-view.css';

import _ from 'lodash';
import FloodBoard from '../flood-board';
import { colors } from '../utils';
import AutomatedPlayer from '../automated-player';
import FloodSelect from '../react-tools/flood-board-select';

export default class FloodBoardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      floodBoard: '',
      inPlayBoard: '',
      size: '',
      colorSize: '',
      sizeOptions: '',
      colorSizeOptions: '',
      totalSteps: 1,
      currentSteps: 0,
      win: false
    };
  }

  componentWillMount() {
    let sizes = Array.from(Array(15), (_, x) => x + 6);
    let sizeOptions = [];
    sizes.forEach(size => {
      sizeOptions.push({ value: size, label: size + ' X ' + size });
    });
    let colorSize = Array.from(Array(4), (_, x) => x + 3);
    let colorSizeOptions = [];
    colorSize.forEach(size => {
      colorSizeOptions.push({ value: size, label: size + ' Colors ' });
    });
    this.setState({
      size: sizeOptions[0].value,
      colorSize: colorSizeOptions[0].value,
      sizeOptions: sizeOptions,
      colorSizeOptions: colorSizeOptions
    });
  }

  componentDidMount() {
    this.generateNewBoard();
  }

  generateBoardColumn(floodBoard, i) {
    let colorBlocks = [];
    let squareBoardSize = floodBoard.length;
    for (let j = 0; j < squareBoardSize; j++) {
      let color = floodBoard[j][i];
      colorBlocks.push(
        <div
          key={'block' + j}
          className="colorBlock"
          style={{ backgroundColor: color }}
        />
      );
    }
    return colorBlocks;
  }

  displayFloodBoard(floodBoard) {
    let squareBoardSize = floodBoard.length;

    let displayBoard = [];
    for (let i = 0; i < squareBoardSize; i++) {
      let column = (
        <td key={'column' + i}>{this.generateBoardColumn(floodBoard, i)}</td>
      );

      displayBoard.push(column);
    }

    return displayBoard;
  }

  generateNewBoard() {
    let fb = new FloodBoard(this.state.size, this.state.colorSize);
    let floodBoard = fb.createNewFloodBoard();
    let inPlayBoard = JSON.parse(JSON.stringify(floodBoard));
    let ap = new AutomatedPlayer(inPlayBoard);
    let result = ap.startPlaying();
    this.setState({
      floodBoard: JSON.parse(JSON.stringify(floodBoard)),
      inPlayBoard: JSON.parse(JSON.stringify(floodBoard)),
      totalSteps: result.steps,
      currentSteps: 0
    });
  }

  floodColor(inPlayBoard, color) {
    let cornorColor = inPlayBoard[0][0];
    let ap = new AutomatedPlayer(inPlayBoard);
    let floodedBoard = ap.findAllTilesAndFloodWithPassedColor(
      inPlayBoard,
      color
    );
    let currentSteps = this.state.currentSteps;
    let win = this.state.win;
    if (floodedBoard[0][0] != cornorColor && !win) {
      currentSteps = currentSteps + 1;
    }
    if (
      ap.checkIfBoardFlooded(floodedBoard, floodedBoard.length) &&
      currentSteps <= this.state.totalSteps
    ) {
      win = true;
    }
    this.setState({ inPlayBoard: floodedBoard, currentSteps, win });
    return floodedBoard;
  }

  getFloodingColors(colorSize) {
    let requiredColors = colors.slice(0, colorSize);
    let colorRow = [];

    requiredColors.forEach(color => {
      colorRow.push(
        <div key={color} style={{ margin: '5px', float: 'left' }}>
          <button
            onClick={() => {
              this.floodColor(this.state.inPlayBoard, color);
            }}
            className="btn btn-default btn-circle"
            style={{ backgroundColor: color }}
          />
        </div>
      );
    });

    return colorRow;
  }

  onSelect(name, option) {
    if (name == 'size') {
      this.setState({ size: option.value });
    }
    if (name == 'colorSize') {
      this.setState({ colorSize: option.value });
    }
  }

  getStepsCounter(totalSteps) {
    return <div>{this.state.currentSteps + '/' + this.state.totalSteps}</div>;
  }

  render() {
    return (
      <div
        className="col-md-12"
        style={{ position: 'absolute', top: '30%', left: '30%' }}
      >
        <div>
          <div>
            <h2>Flood-It</h2>
          </div>
          <div className="col-md-2" style={{ margin: '10px', float: 'left' }}>
            <h3>Board Size</h3>
            <FloodSelect
              name="size"
              options={this.state.sizeOptions}
              value={this.state.size}
              onSelect={this.onSelect.bind(this)}
              searchable={false}
            />
          </div>
          <div className="col-md-2" style={{ margin: '10px', float: 'left' }}>
            <h3> Colors</h3>
            <FloodSelect
              name="colorSize"
              options={this.state.colorSizeOptions}
              value={this.state.colorSize}
              onSelect={this.onSelect.bind(this)}
              searchable={false}
            />
          </div>
        </div>
        <div style={{ clear: 'left', margin: '0 0 0 14.5%' }}>
          {_.size(this.state.inPlayBoard) > 0 ? (
            <i
              style={{ margin: '0 1% 0 0' }}
              className="fa fa-refresh hand"
              onClick={() => {
                this.setState({
                  inPlayBoard: JSON.parse(
                    JSON.stringify(this.state.floodBoard)
                  ),
                  currentSteps: 0
                });
              }}
            />
          ) : null}
          <button
            className="btn btn-primary"
            onClick={this.generateNewBoard.bind(this)}
          >
            New Board
          </button>
        </div>
        <div style={{ margin: '2% 0 0 2%' }}>
          <table>
            <tbody>
              <tr>{this.displayFloodBoard(this.state.inPlayBoard)}</tr>
            </tbody>
          </table>
        </div>
        <div style={{ margin: '0 0 0 2%' }}>
          {_.size(this.state.inPlayBoard) > 0
            ? this.getFloodingColors(this.state.colorSize)
            : null}
        </div>
        <div style={{ clear: 'left', margin: '0 0 0 2%' }}>
          {_.size(this.state.inPlayBoard) > 0
            ? this.getStepsCounter(this.state.totalSteps)
            : null}
        </div>
        <div>
          {this.state.win ? <h2>You Win!!</h2> : null}
          {!this.state.win &&
          this.state.currentSteps >= this.state.totalSteps ? (
            <h2>You Lose!!</h2>
          ) : null}
        </div>
        <div>
          <h5>
            Click the color pallets above to Fill the board with a single color.
          </h5>
        </div>
      </div>
    );
  }
}
