# tic-tac-toe
Tic-Tac-Toe: Human vs Computer: Interactive 3x3 Tic-Tac-Toe game in JavaScript with human vs AI gameplay, multiple difficulty levels, and undo/redo functionality. AI implemented using Minimax algorithm with recursion and stack/queue-based move tracking.

## 🚀 Features

* **Advanced AI**: Features three difficulty levels (Easy, Medium, Hard) utilizing the **Minimax Algorithm** for optimal decision-making.
* **Move History (Undo/Redo)**: Full "Backward" and "Forward" navigation during active gameplay.
* **Post-Game Review**: A dedicated Review Mode to traverse the entire match history step-by-step.
* **Responsive UI**: A modern, CSS-grid-based interface with dynamic status updates and move counters.

---

## 🛠️ Data Structure Implementation

The core logic leverages specific data structures to manage the game's timeline:

### 1. Stack (LIFO)

Used for the **Backward/Undo** functionality.

* **Impact**: When a player clicks "Backward," the game pops the most recent state from the `moveHistory` stack. This allows for an instantaneous  restoration of the previous board state.

### 2. Queue (FIFO)

Used for the **Forward/Redo** functionality.

* **Impact**: When a move is undone, it is enqueued into the `redoHistory`. This ensures that "Redo" operations follow the chronological order in which they were originally played.

### 3. Recursion (Minimax)

The "Hard" difficulty uses a recursive Minimax algorithm to evaluate the game tree.

* **Impact**: It predicts all possible outcomes to ensure the AI never loses, assigning scores (10 for win, -10 for loss, 0 for draw) to determine the optimal move.

---

## 📈 Quantifying Impact

The integration of these data structures provides measurable improvements over basic array-based state management:

| Feature | Data Structure | Performance Impact | User Experience Benefit |
| --- | --- | --- | --- |
| **Undo Action** | **Stack** |  Time Complexity | Instantaneous state reversal regardless of game length. |
| **Redo Action** | **Queue** |  Time Complexity | Maintains chronological integrity of future moves. |
| **Memory Management** | **Arrays** |  Space | Efficiently stores only 9 board cells and active move objects. |
| **AI Decision** | **Minimax** |  Complexity | Exhaustive search of all 255,168 possible game board permutations. |

---

## 📂 File Structure

* `data-structures.js`: Custom implementations of `Stack` and `Queue` classes.
* `game.js`: The main game engine containing AI logic, event listeners, and state management.
* `index.html`: The structural layout and UI components.
* `style.css`: Modern styling, animations, and responsive design.

---

## 🎮 How to Run

1. Clone or download the project files.
2. Open `index.html` in any modern web browser.
3. Select a difficulty and play as **X**.
4. Use the **Backward** button to correct mistakes or **Review Game** after a match to analyze your strategy.
