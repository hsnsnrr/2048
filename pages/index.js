import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

const GRID_SIZE = 4;

export default function Home() {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [nickname, setNickname] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const gameStateRef = useRef({ board: [], score: 0, gameStarted: false, gameOver: false });

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    gameStateRef.current = { board, score, gameStarted, gameOver };
  }, [board, score, gameStarted, gameOver]);

  const loadLeaderboard = () => {
    const saved = localStorage.getItem('leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  };

  const initializeBoard = () => {
    const newBoard = Array(GRID_SIZE * GRID_SIZE).fill(0);
    addNewTile(newBoard);
    addNewTile(newBoard);
    return newBoard;
  };

  const addNewTile = (currentBoard) => {
    const emptyTiles = currentBoard
      .map((tile, index) => (tile === 0 ? index : null))
      .filter(val => val !== null);

    if (emptyTiles.length === 0) return;

    const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    currentBoard[randomIndex] = newValue;
  };

  const startGame = () => {
    if (nickname.trim() === '') {
      alert('Lütfen bir isim yazınız!');
      return;
    }
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setShowLeaderboard(false);
  };

  const finishGame = (finalScore) => {
    const newEntry = {
      name: nickname,
      score: finalScore,
      date: new Date().toLocaleDateString('tr-TR')
    };

    let updatedLeaderboard = [newEntry, ...leaderboard];
    updatedLeaderboard = updatedLeaderboard.sort((a, b) => b.score - a.score).slice(0, 10);

    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    setLeaderboard(updatedLeaderboard);
  };

  const moveRow = (row, reverse) => {
    if (reverse) row = row.reverse();

    let packed = row.filter(val => val !== 0);
    let scoreDelta = 0;
    let hasMoved = packed.length !== row.filter(val => val !== 0).length;

    for (let i = 0; i < packed.length - 1; i++) {
      if (packed[i] === packed[i + 1]) {
        packed[i] *= 2;
        scoreDelta += packed[i];
        packed.splice(i + 1, 1);
        hasMoved = true;
      }
    }

    while (packed.length < GRID_SIZE) {
      packed.push(0);
    }

    if (reverse) packed = packed.reverse();

    return { row: packed, hasMoved, scoreDelta };
  };

  const isGameOver = (currentBoard) => {
    if (currentBoard.some(tile => tile === 0)) return false;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const index = i * GRID_SIZE + j;
        const current = currentBoard[index];

        if (j < GRID_SIZE - 1 && current === currentBoard[index + 1]) return false;
        if (i < GRID_SIZE - 1 && current === currentBoard[(i + 1) * GRID_SIZE + j]) return false;
      }
    }

    return true;
  };

  const move = (direction) => {
    const state = gameStateRef.current;
    if (!state.gameStarted || state.gameOver || state.board.length === 0) return;

    let newBoard = state.board.map(x => x);
    let moved = false;
    let newScore = state.score;

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let row = newBoard.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE);
        const result = moveRow(row, direction === 'right');
        newScore += result.scoreDelta;
        moved = moved || result.hasMoved;
        for (let j = 0; j < GRID_SIZE; j++) {
          newBoard[i * GRID_SIZE + j] = result.row[j];
        }
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let column = [];
        for (let j = 0; j < GRID_SIZE; j++) {
          column.push(newBoard[j * GRID_SIZE + i]);
        }
        const result = moveRow(column, direction === 'down');
        newScore += result.scoreDelta;
        moved = moved || result.hasMoved;
        for (let j = 0; j < GRID_SIZE; j++) {
          newBoard[j * GRID_SIZE + i] = result.row[j];
        }
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (isGameOver(newBoard)) {
        setGameOver(true);
        setTimeout(() => finishGame(newScore), 300);
      }
    }
  };

  // Klavye kontrolü - SABIT!
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        move('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Touch kontrolü (MOBİL) - YENİ!
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX.current - touchEndX;
      const diffY = touchStartY.current - touchEndY;

      const threshold = 50;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > threshold) {
          move('left');
        } else if (diffX < -threshold) {
          move('right');
        }
      } else {
        if (diffY > threshold) {
          move('up');
        } else if (diffY < -threshold) {
          move('down');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>2048 Oyunu</h1>

      {!gameStarted ? (
        <div className={styles.startScreen}>
          <div className={styles.card}>
            <h2>Hoşgeldiniz!</h2>
            <input
              type="text"
              placeholder="Oyuncu adınız..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
              className={styles.input}
              autoFocus
            />
            <button onClick={startGame} className={styles.playButton}>
              Oynamaya Başla
            </button>
            <button onClick={() => setShowLeaderboard(!showLeaderboard)} className={styles.leaderboardButton}>
              Skor Tablosu
            </button>
          </div>

          {showLeaderboard && (
            <div className={styles.leaderboardContainer}>
              <h3>🏆 En İyi 10 Skor 🏆</h3>
              {leaderboard.length === 0 ? (
                <p>Henüz kimse oynamadı</p>
              ) : (
                <table className={styles.leaderboardTable}>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{entry.name}</td>
                        <td>{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.gameScreen}>
          <div className={styles.header}>
            <div>
              <p>Oyuncu: <strong>{nickname}</strong></p>
              <p>Skor: <strong>{score}</strong></p>
            </div>
            <button onClick={() => setGameStarted(false)} className={styles.backButton}>
              Geri Dön
            </button>
          </div>

          <div className={styles.gameContainer}>
            <div className={styles.board}>
              {board.map((tile, index) => (
                <div
                  key={index}
                  className={`${styles.tile} ${styles[`tile${tile}`]}`}
                >
                  {tile !== 0 && <span>{tile}</span>}
                </div>
              ))}
            </div>
          </div>

          {gameOver && (
            <div className={styles.gameOverScreen}>
              <div className={styles.gameOverCard}>
                <h2>Oyun Bitti!</h2>
                <p>Final Skor: <strong>{score}</strong></p>
                <button onClick={() => startGame()} className={styles.playButton}>
                  Tekrar Oyna
                </button>
              </div>
            </div>
          )}

          <div className={styles.controls}>
            <p>⌨️ Ok Tuşları • 👆 Kaydır (Mobil)</p>
          </div>
        </div>
      )}
    </div>
  );
}
