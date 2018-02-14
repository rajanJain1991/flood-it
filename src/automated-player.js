import { colors } from './utils';
import _ from 'lodash';

export default class AutomatedPlayer {
  constructor(floodBoard) {
    this.floodBoard = floodBoard;
    this.colorTileSizeMap = {};
    this.edges = [];
    this.originColor = [];
  }

  getValidIndexArray(x, y, dimension) {
    let holdTempXY = [];
    let tempX, tempY;
    //up tile
    tempX = x - 1;
    tempY = y;
    if (tempX > -1) {
      holdTempXY.push([tempX, tempY]);
    }
    //down tile
    tempX = x + 1;
    if (tempX < dimension) {
      holdTempXY.push([tempX, tempY]);
    }
    //left tile
    tempX = x;
    tempY = y - 1;
    if (tempY > -1) {
      holdTempXY.push([tempX, tempY]);
    }
    //right tile
    tempY = y + 1;
    if (tempY < dimension) {
      holdTempXY.push([tempX, tempY]);
    }
    return holdTempXY;
  }

  //find Edges to the color flooded from origin
  findingEdges(playedFloodBoard) {
    let cornorColor = playedFloodBoard[0][0];
    let dimension = playedFloodBoard.length;
    let findEdges = true;
    let x = 0,
      y = 0;
    let originColor = [[0, 0]];
    let edges = [];
    let expanding = [[0, 0]];

    let present = [];
    while (findEdges) {
      let tempExpanding = [];
      expanding.forEach(arr => {
        x = arr[0];
        y = arr[1];
        let holdTempXY = this.getValidIndexArray(x, y, dimension);

        holdTempXY.forEach(arr => {
          if (playedFloodBoard[arr[0]][arr[1]] == cornorColor) {
            present = originColor.filter(index =>
              _.isEqual(index, [arr[0], arr[1]])
            );
            if (present.length == 0) {
              tempExpanding.push([arr[0], arr[1]]);
              originColor.push([arr[0], arr[1]]);
            }
          } else {
            present = edges.filter(index => _.isEqual(index, [arr[0], arr[1]]));
            if (present.length == 0) {
              edges.push([arr[0], arr[1]]);
            }
          }
        });
      });
      expanding = tempExpanding;
      if (expanding.length == 0) {
        findEdges = false;
      }
    }

    this.edges = edges;
    this.originColor = originColor;
  }

  calculateColorTileSizeMap(playedFloodBoard, edges) {
    let colorTileSizeMap = {};
    edges.forEach(index => {
      let x = index[0];
      let y = index[1];
      let color = playedFloodBoard[x][y];

      if (colorTileSizeMap[color] == null) {
        colorTileSizeMap[color] = [[x, y]];
      } else {
        colorTileSizeMap[color].push([x, y]);
      }
      let calculating = true;
      let present = [];
      let expanding = [[x, y]];

      while (calculating) {
        let tempExpanding = [];
        expanding.forEach(index => {
          let holdTempXY = this.getValidIndexArray(
            index[0],
            index[1],
            playedFloodBoard.length
          );

          holdTempXY.forEach(arr => {
            if (playedFloodBoard[arr[0]][arr[1]] == color) {
              present = colorTileSizeMap[color].filter(index =>
                _.isEqual(index, [arr[0], arr[1]])
              );
              if (present.length == 0) {
                tempExpanding.push([arr[0], arr[1]]);
                colorTileSizeMap[color].push([arr[0], arr[1]]);
              }
            }
          });
        });

        expanding = tempExpanding;
        if (expanding.length == 0) {
          calculating = false;
        }
      }
    });
    this.colorTileSizeMap = colorTileSizeMap;
    return colorTileSizeMap;
  }

  //This function will return the color which is most found which is attached to the origin
  findColorToFlood(playedFloodBoard) {
    this.findingEdges(playedFloodBoard);
    let colorTileSizeMap = this.calculateColorTileSizeMap(
      playedFloodBoard,
      this.edges
    );
    let colorTileSizeArray = [];
    Object.keys(colorTileSizeMap).forEach((key, index) => {
      let pos = colors.indexOf(key);
      colorTileSizeArray.push({
        color: key,
        size: colorTileSizeMap[key].length,
        priority: pos
      });
    });
    colorTileSizeArray.sort((a, b) => {
      if (a.size > b.size) {
        return -1;
      } else if (a.size < b.size) {
        return 1;
      }
      if (a.priority < b.priority) {
        return -1;
      }
      return 1;
    });

    return colorTileSizeArray[0].color;
  }

  //This function takes board and color to be flooded as input parameter and return the flooded board
  floodBoardWithPassedColor(playedFloodBoard, color, originColor) {
    let result = playedFloodBoard;
    originColor.forEach(index => {
      result[index[0]][index[1]] = color;
    });
    return result;
  }

  //This function return the board after flooding with demanded color
  findAllTilesAndFloodWithPassedColor(inPlayBoard, color) {
    this.findingEdges(inPlayBoard);
    return this.floodBoardWithPassedColor(inPlayBoard, color, this.originColor);
  }

  checkIfBoardFlooded(playedFloodBoard, dimension) {
    let cornorColor = playedFloodBoard[0][0];
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (cornorColor != playedFloodBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  //This function returns the number of totalSteps taken to flood the board, color sequence and flooded board.
  startPlaying() {
    let playedFloodBoard = this.floodBoard;
    let steps = 0;
    let colorSequence = [];

    if (playedFloodBoard == null) {
      return -1;
    }

    let dimension = playedFloodBoard.length;

    let boardFullyFlooded = false;

    while (!boardFullyFlooded) {
      boardFullyFlooded = true;
      let foundColor = this.findColorToFlood(playedFloodBoard);
      playedFloodBoard = this.floodBoardWithPassedColor(
        playedFloodBoard,
        foundColor,
        this.originColor
      );
      steps = steps + 1;
      colorSequence.push(foundColor);

      boardFullyFlooded = this.checkIfBoardFlooded(playedFloodBoard, dimension);
    }

    return { steps, colorSequence, playedFloodBoard };
  }
}
