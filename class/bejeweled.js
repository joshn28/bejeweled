const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {

    // Initialize this
    this.grid = [];

    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(false);

    const gems = ["🍓", "🍋", "🍊", "🍇", "🥥", "🥝"];

    while(this.grid.length < 8) {
      const row = [];

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * gems.length);
        const gem = gems[randomIndex];

        row.push(gem);
      }

      this.grid.push(row);
    }

    this.eliminateMatches();

    this.score = 0;
    this.matches = 0;

    this.refreshScreen();

    Screen.setMessage(`
    Score: ${this.score}
    Matches Multiplier: ${this.matches}x
    `);

    Screen.addCommand('up', 'move cursor up', () => {
      this.makeMove('up');
    });
    Screen.addCommand('down', 'move cursor down', () => {
      this.makeMove('down');
    });
    Screen.addCommand('left', 'move cursor left', () => {
      this.makeMove('left');
    });
    Screen.addCommand('right', 'move cursor right', () => {
      this.makeMove('right');
    });
    Screen.addCommand('x', 'select a gem', () => {
      if (this.cursor.state === 'select') {
        this.cursor.state = 'swap';
        this.cursor.cursorColor = 'green';
        this.cursor.setBackgroundColor();
        Screen.render();
      } else {
        this.changeGameState();
      }
    });

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  refreshScreen = () => {
    this.grid.forEach((row, rowIndex) => {
      row.forEach((gem, colIndex) => {
        Screen.setGrid(rowIndex, colIndex, gem);
      });
    });
    
    Screen.render();
  }

  makeMove(dir) {
    if (this.cursor.state === 'select') {
      if (dir === 'up') {
        this.cursor.up();
      } else if (dir === 'down') {
        this.cursor.down();
      } else if (dir === 'left') {
        this.cursor.left();
      } else if (dir === 'right') {
        this.cursor.right();
      } 
    } else {
      this.swapGems(dir);
    }
  }

  changeGameState() {
    if (Bejeweled.checkForPossibleMoves) {
      this.cursor.state = 'select';
      this.cursor.cursorColor = 'yellow';
      this.cursor.setBackgroundColor();
      Screen.render();
    } else {
      Screen.quit();
    }
    
  }

  swapGems(dir) {

    const currGem = this.grid[this.cursor.row][this.cursor.col];
    let gemToBeSwapped;

    if (dir === 'up' && this.cursor.row - 1 >= 0) {
      gemToBeSwapped = this.grid[this.cursor.row - 1][this.cursor.col];
      this.grid[this.cursor.row - 1][this.cursor.col] = currGem;
      this.grid[this.cursor.row][this.cursor.col] = gemToBeSwapped;

      if (Bejeweled.checkForMatch(this.grid, this.cursor.row, this.cursor.col)) {
        this.eliminateMatches();
      } else {
        this.grid[this.cursor.row - 1][this.cursor.col] = gemToBeSwapped;
        this.grid[this.cursor.row][this.cursor.col] = currGem;
      }

    } else if (dir === 'down' && this.cursor.row + 1 < this.grid.length) {
      gemToBeSwapped = this.grid[this.cursor.row + 1][this.cursor.col];
      this.grid[this.cursor.row + 1][this.cursor.col] = currGem;
      this.grid[this.cursor.row][this.cursor.col] = gemToBeSwapped;

      if (Bejeweled.checkForMatch(this.grid, this.cursor.row, this.cursor.col)) {
        this.eliminateMatches();
      } else {
        this.grid[this.cursor.row + 1][this.cursor.col] = gemToBeSwapped;
        this.grid[this.cursor.row][this.cursor.col] = currGem;
      }

    } else if (dir === 'left' && this.cursor.col - 1 >= 0) {
      gemToBeSwapped = this.grid[this.cursor.row][this.cursor.col - 1];
      this.grid[this.cursor.row][this.cursor.col - 1] = currGem;
      this.grid[this.cursor.row][this.cursor.col] = gemToBeSwapped;

      if (Bejeweled.checkForMatch(this.grid, this.cursor.row, this.cursor.col)) {
        this.eliminateMatches();
      } else {
        this.grid[this.cursor.row][this.cursor.col - 1] = gemToBeSwapped;
        this.grid[this.cursor.row][this.cursor.col] = currGem;
      }

    } else if (dir === 'right' && this.cursor.col + 1 < this.grid.length) {
      gemToBeSwapped = this.grid[this.cursor.row][this.cursor.col + 1];
      this.grid[this.cursor.row][this.cursor.col + 1] = currGem;
      this.grid[this.cursor.row][this.cursor.col] = gemToBeSwapped;

      if (Bejeweled.checkForMatch(this.grid, this.cursor.row, this.cursor.col)) {
        this.eliminateMatches();
      } else {
        this.grid[this.cursor.row][this.cursor.col + 1] = gemToBeSwapped;
        this.grid[this.cursor.row][this.cursor.col] = currGem;
      }

    }

    this.changeGameState();
  }

  eliminateMatches() {
    this.eliminateMatch(this.cursor.row, this.cursor.col);

    let totalPos = 0;

    while (totalPos < this.grid.length ** 2) {
      this.grid.forEach((row, rowIndex) => {
        row.forEach((gem, colIndex) => {
          if (Bejeweled.checkForMatch(this.grid, rowIndex, colIndex)) {
            this.eliminateMatch(rowIndex, colIndex);
          } else {
            totalPos++;
          }
        });
      });
    }

    this.matches = 0;
    
    this.refreshScreen();
  }

  eliminateMatch(row, col) {    
    let gem = this.grid[row][col];

    if (row + 2 < this.grid.length) {
      if (
        this.grid[row + 1][col] === gem &&
        this.grid[row + 2][col] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row + 1][col] = ' ';
          this.grid[row + 2][col] = ' ';
          
          this.makeItemsFall();
      }
    } 
    
    if (row - 2 >= 0) {
      if (
        this.grid[row - 1][col] === gem &&
        this.grid[row - 2][col] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row - 1][col] = ' ';
          this.grid[row - 2][col] = ' ';
  
          this.makeItemsFall();
      }  
    } 
    
    if (row + 1 < this.grid.length && row - 1 >= 0) {

      if (
        this.grid[row + 1][col] === gem &&
        this.grid[row - 1][col] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row + 1][col] = ' ';
          this.grid[row - 1][col] = ' ';
  
          this.makeItemsFall();
      }
    }
    
    if (col + 2 < this.grid.length) {
      if (
        this.grid[row][col + 1] === gem &&
        this.grid[row][col + 2] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row][col + 1] = ' ';
          this.grid[row][col + 2] = ' ';
  
          this.makeItemsFall();
      }
    } 
    
    if (col - 2 >= 0) {
      if (
        this.grid[row][col - 1] === gem &&
        this.grid[row][col - 2] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row][col - 1] = ' ';
          this.grid[row][col - 2] = ' ';
  
          this.makeItemsFall();
      } 
    } 
    
    if (col + 1 < this.grid.length && col - 1 >= 0) {

      if (
        this.grid[row][col - 1] === gem &&
        this.grid[row][col + 1] === gem) {
  
          this.grid[row][col] = ' ';
          this.grid[row][col - 1] = ' ';
          this.grid[row][col + 1] = ' ';
          
          this.makeItemsFall();
      }
    } 

    if (this.score !== undefined && this.matches !== undefined) {
        this.matches++;
      if (this.matches <= 1) {
        this.score += 5;
      } else {
        this.score += 5 * this.matches;
      }
    }

    Screen.setMessage(`
    Score: ${this.score}
    Matches Multiplier: ${this.matches}x
    `);
  }

  makeItemsFall() {

    for (let rowIndex = this.grid.length - 1; rowIndex > 0; rowIndex--) {
      const row = this.grid[rowIndex];

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (row[colIndex] === ' ') {
          this.grid[rowIndex][colIndex] = this.getItemAbove(rowIndex, colIndex);
        }
      }
    }

    this.generateNewItems();
  }

  getItemAbove(rowIndex, colIndex) {

    while(this.grid[rowIndex][colIndex] === ' ' && rowIndex > 0) {
      rowIndex--;
    }

    let gem = this.grid[rowIndex][colIndex];
    this.grid[rowIndex][colIndex] = ' ';

    return gem;
  }

  generateNewItems() {

    this.grid.forEach((row, rowIndex) => {
      row.forEach((gem, colIndex) => {
        if (gem === ' ') {
          const gems = ["🍓", "🍋", "🍊", "🍇", "🥥", "🥝"];
          const randomIndex = Math.floor(Math.random() * gems.length);
          const randomGem = gems[randomIndex];

          this.grid[rowIndex][colIndex] = randomGem;
        }
      })
    });
  }

  static checkForMatch(grid, row, col) {

    let gem = grid[row][col];

    // check for vertical matches
    if (row + 2 < grid.length) {
      if (grid[row + 2][col] === gem && grid[row + 1][col] === gem) {     
        return true;
      }
    }

    if (row - 2 >= 0) {
      if (grid[row - 2][col] === gem && grid[row - 1][col] === gem) {
        return true;
      }
    }

    if (row + 1 < grid.length && row - 1 >= 0) {
      if (grid[row + 1][col] === gem && grid[row - 1][col] === gem) {
        return true;
      }
    }
    
    // check for horizontal matches
    if (col + 2 < grid.length) {
      if (grid[row][col + 2] === gem && grid[row][col + 1] === gem) {
        return true;
      }
    }

    if (col - 2 >= 0) {
      if (grid[row][col - 2] === gem && grid[row][col - 1] === gem) {
        return true;
      }
    }

    if (col + 1 < grid.length && col - 1 >= 0) {
      if (grid[row][col + 1] === gem && grid[row][col - 1] === gem) {

        return true;
        
      }
    }

    return false;
  }

  static checkForPossibleMoves(grid) {

    let match = false;

    grid.forEach((row, rowIndex) => {
      row.forEach((gem, colIndex) => {
        if (Bejeweled.checkForMatch(grid, rowIndex, colIndex)) {
          match = true;
          return;
        }

        let gemToBeSwapped;

        if (rowIndex + 1 < grid.length) {
          gemToBeSwapped = grid[rowIndex + 1][colIndex];

          grid[rowIndex + 1][colIndex] = gem;
          grid[rowIndex][colIndex] = gemToBeSwapped;

          if (Bejeweled.checkForMatch(grid, rowIndex, colIndex)) {
            match = true;
            return;
          } else {
            grid[rowIndex + 1][colIndex] = gemToBeSwapped;
            grid[rowIndex][colIndex] = gem;
          }
        }

        if (colIndex + 1 < grid.length) {
          gemToBeSwapped = grid[rowIndex][colIndex + 1];

          grid[rowIndex][colIndex + 1] = gem;
          grid[rowIndex][colIndex] = gemToBeSwapped;

          if (Bejeweled.checkForMatch(grid, rowIndex, colIndex)) {
            match = true;
            return;
          } else {
            grid[rowIndex][colIndex + 1] = gemToBeSwapped;
            grid[rowIndex][colIndex] = gem;
          }
        }

        if (rowIndex - 1 >= 0) {
          gemToBeSwapped = grid[rowIndex - 1][colIndex];

          grid[rowIndex - 1][colIndex] = gem;
          grid[rowIndex][colIndex] = gemToBeSwapped;

          if (Bejeweled.checkForMatch(grid, rowIndex, colIndex)) {
            match = true;
            return;
          } else {
            grid[rowIndex - 1][colIndex] = gemToBeSwapped;
            grid[rowIndex][colIndex] = gem;
          }
        }

        if (colIndex - 1 >= 0) {
          gemToBeSwapped = grid[rowIndex][colIndex - 1];

          grid[rowIndex][colIndex - 1] = gem;
          grid[rowIndex][colIndex] = gemToBeSwapped;
          
          if (Bejeweled.checkForMatch(grid, rowIndex, colIndex)) {
            match = true;
            return;
          } else {
            grid[rowIndex][colIndex - 1] = gemToBeSwapped;
            grid[rowIndex][colIndex] = gem;
          }
        }
      });
    });

    return match;
  }

}

module.exports = Bejeweled;
