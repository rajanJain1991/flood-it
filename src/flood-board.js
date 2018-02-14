import {getRandomWholeNumbers, colors} from './utils'


export default class FloodBoard {

    constructor(size, noOfColors) {
        this.state = {
            squareBoardSize: size || 6,
            noOfColors: noOfColors || 3,
            colors: colors,
            floodBoard: []
        }
        this.createNewFloodBoard.bind(this);
    }

    getRandomColors(noOfColors) {
        let randomNumber = getRandomWholeNumbers(noOfColors);
        return this.state.colors[randomNumber];
    }

    createNewFloodBoard() {
        let noOfColors = this.state.noOfColors > 6 ? 6 : this.state.noOfColors;
        let squareBoardSize = this.state.squareBoardSize > 20 ? 20 : this.state.squareBoardSize;
        let newFloodBoard = new Array(squareBoardSize);

        for (let i = 0; i < squareBoardSize; i++) {
            newFloodBoard[i] = new Array(squareBoardSize);
            for (let j = 0; j < squareBoardSize; j++) {
                newFloodBoard[i][j] = this.getRandomColors(noOfColors);
            }
        }

        // this.setState({squareBoardSize,
        //     noOfColors,
        //     floodBoard: newFloodBoard});

        return newFloodBoard;
    }

}