// Importação do react, react-dom e a estrutura CSS do projeto
import React from 'react'; 
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { // Os quadrados são botões
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
        status = 'Vencedor: ' + winner + '! Parabéns, ganhou um bolo'; // Caso tenha algum ganhador na partida, essa será a mensagem que aparecerá para o usuário
    }
    else {
        status = 'Turno do : ' + (this.state.xIsNext ? 'X' : 'O'); // 'Caso contrário' ou seja, enquanto o jogo não terminar, será essa a mensagem que aparecerá, dando continuidade ao jogo
    } // É possível fazer um novo else para caso tenha impate e não há um jogador, pois por enquanto a mensagem que irá aparecer é somente a que está agora, 'Turno do:' e o próximo jogador.

    return ( // É aqui onde está renderizando os quadrados que é possível visualizar no projeto, todos eles numerados de 0 ao 8 e utilizando a estrutura do HTML
      <div>
        <div className="status">{status}</div> 
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  
  
  // ========================================
  
  ReactDOM.render( // Tem a função chamada render, onde é passado um parâmetro e executa um elemento
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) { // Função que determina o jogador, ou seja, aquele que preencha um dos três quadrados em uma das linhas, inclusive na vertical
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}