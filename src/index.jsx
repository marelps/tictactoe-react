// Importação do react, react-dom e a estrutura CSS do projeto
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Os quadrados do jogo da velha são botões nomeados como 'square'
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// ========================================
class Board extends React.Component {
  /* Esse constructor deve ser deletado para o funcionamento do constructor na class Game, a class de mais alto nível, caso o projeto não tivesse o histórico de jogadas, esse constructor ainda estaria em funcionamento na class Board e não na Game

  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }*/
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // É aqui onde está renderizando os quadrados que é possível visualizar no projeto, todos eles numerados de 0 ao 8 e utilizando a estrutura do HTML
  render() {
    return (
      <div>
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

// ========================================
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0, // Definições de chave
      xIsNext: true,
    };
  }
  /* O state stepNumber que adicionamos reflete a jogada mostrada ao usuário nesse momento. Após fazermos uma nova jogada, precisamos atualizar stepNumber adicionando stepNumber: history.length como parte do argumento de this.setState. Isso certifica que não ficaremos presos mostrando a mesma jogada após uma novo ter sido feita. 
  
  O .slice em 'this.state.history.slice()' Certifica que se nós "voltarmos no tempo", e então fizermos uma nova jogada a partir daquele ponto, descartamos todo o histórido do "futuro" que agora se tornaria incorreto.
  */
  handleClick(i) {
    const history = this.state.history.slice(0,
        this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
    // Ao contrário do método de arrays push(), o método concat() não modifica o array original, por isso preferimos utilizá-lo.
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  /* Observe no método jumpTo, não atualizamos a propriedade de histórico do estado. Isso ocorre porque as atualizações de estado são mescladas ou, em palavras mais simples, o react atualizará apenas as propriedades mencionadas no método setState, deixando o estado restante como está. */
  jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Array utilizado para mapear uma fonte de dados para outra fonte de dados
    const moves = history.map((step, move) => { 
        const desc = move ?
        'Ir para o ' + move + 'º movimento' : 'Ir para o início do jogo'; // Texto que estará escrito no botão onde irá voltar determinadas jogadas da partida e também um outro botão para voltar ao início do jogo, como um reset
        // Retornando o botão que conterá o histórico de jogos dito anteriormente no const desc
        return ( // Definido as chaves da jogada
            <li key={move}> 
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
      status = 'Vencedor: ' + winner + '! Parabéns, ganhou um bolo :D'; // Caso tenha algum ganhador na partida, essa será a mensagem que aparecerá para o usuário
    } else {
      status = 'Turno do : ' + (this.state.xIsNext ? 'X' : 'O'); // Caso contrário ou seja, enquanto o jogo não terminar, será essa a mensagem que aparecerá, dando continuidade ao jogo
    }
    // Obs: É possível fazer um novo else para caso tenha impate e não há um jogador, pois por enquanto a mensagem que irá aparecer é somente a que está agora, 'Turno do:' e o próximo jogador.

    /* Aqui onde irá retornar todo o conteúdo do site.
        Na div game-board é onde está os quadrados(button) do jogo junto com o efeito de clique que marca X e O, pois o valor padrão é null 
        Na div game-info é onde mostra o status, aquele texto que escreve de quem deve ser a jogada atual e os botões listado numéricamentes <ol> ao lado com o histórico de movimentos e botão de resetar a partida do jogo.

        /!\ Importante: Cada filho de um array ou iterator deve ter uma prop “key” única. /!\
    */
    return ( 
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// Tem a função chamada render, onde é passado um parâmetro e executa um elemento
ReactDOM.render( 
  <Game />,
  document.getElementById("root")
);

// Função que determina o jogador, ou seja, aquele que preencha um dos três quadrados em uma das linhas, inclusive na vertical
function calculateWinner(squares) { 
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
