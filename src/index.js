import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
       {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return( 
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const squares = [];
    let row = [];
    for(var i = 0; i < 9; i++){
      row.push(this.renderSquare(i));
      if(row.length == 3){ 
        squares.push(<div className="board-row">{row}</div>);
        row = [];
      }
    }

    return (<div>{squares}</div>);
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      lastMove: null,
    }
  }
  
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      lastMove: i
    });
  }
 
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      let style = isBolded(this.state.stepNumber, move)
      return(
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            style={style}
          >{desc}</button>
        </li>
      )
    })

    let status;
    if(winner){
      status = "Winner: " + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    let lastMove = getPlacedPosition(this.state.lastMove); 

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{lastMove}</div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function isBolded(step, currentStep){
  if(step == currentStep){
    return {
      color: 'red'
    }
  }

  return null;
}

function getPlacedPosition(placed){
  const post= [
    "(1,1)",
    "(2,1)",
    "(3,1)",
    "(1,2)",
    "(2,2)",
    "(3,2)",
    "(1,3)",
    "(2,3)",
    "(3,3)",
  ]
  if(placed != null){
    return "Last placed: " + post[placed];
  }
  return "This is the first move!";
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],//horizontal
    [3,4,5],
    [6,7,8],
    [0,3,6],//Vertical
    [1,3,7],
    [2,5,8],
    [0,4,8],//Diagonal
    [2,4,6],
  ];
  for(let i = 0; i < lines.length; i++){
    const[a,b,c] = lines[i];
    if(squares[a] && squares[a] == squares[b] && squares[b] == squares[c]){
      return squares[a]
    }
  }
  return null;
}
