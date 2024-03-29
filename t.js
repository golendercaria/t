import React, { Component } from 'react'
import './App.css'
import Grid from './Grid'
import pieceCollection from './pieceCollection'

class App extends Component{

	state = {
		grid: null,
		gridHeight: 10,
		gridWidth: 8,
		piece:null
	}

	componentDidMount() { 
		this.initGame()

		window.addEventListener("keyup", (e) => { 
			
			console.log(e.keyCode)

			switch (e.keyCode) { 
				case 39: this.pieceMoveToXAxis(1)
					break
				case 37: this.pieceMoveToXAxis(-1)
					break
				case 40: this.pieceMoveToYAxis(1)
					break
				case 88: this.pieceRotateRight()
					break
				default: break
			}

			//37 gauche
			//39 right
			//bas 40
		})
	}

	initGame = () => {
		this.setState({ grid: this.buildGrid() }, () => {
			this.generatePiece()
		})
	}

	//GRID FUNCTIONS
	buildGrid = () => {

		let grid = []

		for (let y = 0; y < this.state.gridHeight; y++) {
			let line = []
			for (let x = 0; x < this.state.gridWidth; x++) {
				line.push(0);
			}
			grid.push(line)
		}

		return grid

	}

	mergePieceToGrid = () => {

		const virtualGrid = this.state.grid

		this.state.piece.mergeData.forEach(element => {
			const [y, x] = element.split("_")
			virtualGrid[y][x] = this.state.piece.color
		});

		this.setState({ grid: virtualGrid, piece: null }, () => { 
			this.generatePiece()
		})
	}

	//PIECE FUNCTIONS
	generatePiece = () => {

		let piece = {}
		piece.posX = 0
		piece.posY = 0
		piece.grid = pieceCollection[0]
		piece.mergeData = []
		piece.color = Math.floor( Math.random() * 5)

		let coordinate = this.pieceCanBeMove(piece)

		if (coordinate !== false) { 
			piece.mergeData = coordinate
			this.setState({piece})	
		}

	}

	pieceCanBeMove = (piece) => { 
		
		let coordinate = []

		for (let y = 0; y < piece.grid.length; y++) {
			for (let x = 0; x < piece.grid[0].length; x++) {
				if (piece.grid[y][x] > 0) { 

					if (this.state.grid[y + piece.posY] === undefined) { 
						return false // out of range Y
					}

					if (this.state.grid[y + piece.posY][x + piece.posX] === undefined) { 
						return false //out of range X
					}

					if (this.state.grid[y + piece.posY][x + piece.posX] > 0) { 
						return false
					}

					coordinate.push( (y + piece.posY) + "_" + (x + piece.posX) )
				}
			}
		}

		return coordinate

	}

	pieceMoveToXAxis = (deltaX) => { 
		
		let piece = { ...this.state.piece }

		if (piece === null) { 
			return false
		}

		piece.posX += deltaX

		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) { 
			piece.mergeData = coordinate
			this.setState({piece})
		}

	}


	pieceMoveToYAxis = (deltaY) => { 
		
		let piece = { ...this.state.piece }

		if (piece === null) { 
			return false
		}

		piece.posY += deltaY

		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) {
			piece.mergeData = coordinate
			this.setState({ piece })
		} else { 
			this.mergePieceToGrid()
		}

	}

	pieceRotateRight = () => {

		console.log(this.state.piece.grid)
		
		//virtualGrid = [...this.state.piece.grid]
		let newGrid = [];
		
		for (let x = 0; x < this.state.piece.grid[0].length; x++) {
			let line = []
			for (let y = this.state.piece.grid.length - 1; y > -1; y--) {
				line.push( this.state.piece.grid[y][x] )
			}
			newGrid.push( line )
		}

		console.log(newGrid)
	}

	render() { 
		return (
			<div id="wrapper_tetris">
				<h1>Tetris</h1>
				{
					this.state.grid !== null &&
						<Grid
							grid={this.state.grid}
							piece={this.state.piece}
						/>
				}
			</div>
		)
	}

}

export default App;
