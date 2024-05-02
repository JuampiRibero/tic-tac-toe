import { useState } from "react";
import { TURNS } from "./constants.js";
import { checkWinner, checkEndGame } from "./logic/board.js";
import confetti from "canvas-confetti";
import { WinnerModal } from "./components/WinnerModal.jsx";
import { Board } from "./components/Board.jsx";
import { Turn } from "./components/Turn.jsx";
import { resetGameStorage, saveGameToStorage } from "./logic/storage.js";

const App = () => {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });

  // Null quiere decir que no hay ganador, false quiere decir que hay empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  };

  const updateBoard = (index) => {
    // No actualizo esta posicion si ya contiene algo o hay un ganador
    if (board[index] || winner) return;
    // Actualizo el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    // Cambio de turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // Guardo partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
    });
    // Reviso si hay un ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti({
        particleCount: 200,
        startVelocity: 40,
        spread: 360,
      });
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1 className="title">TRES EN RAYA</h1>
      <button onClick={resetGame}>REINICIAR</button>
      <Board board={board} updateBoard={updateBoard} />
      <Turn turn={turn} />
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
};

export default App;
