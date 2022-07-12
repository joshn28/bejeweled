const { expect } = require('chai');

const Bejeweled = require("../class/bejeweled.js");

describe ('Bejeweled', function () {

  const board = new Bejeweled();
  const cursor = board.cursor;

  context('board with randomly generated gems', function() {

    // Add tests for setting up a basic board
    it('should set up the board properly', function() {
      expect(board.grid.length).to.eq(8);

      board.grid.forEach(row => {
        expect(row.length).to.eq(8);
      });
    });

  });

  context('board with gems that aren\'t randomly generated', function() {

    beforeEach(function() {
      board.grid = [
        ['A', 'A', 'C', 'D', 'E', 'A', 'B', 'C'],
        ['D', 'E', 'A', 'B', 'C', 'D', 'E', 'A'],
        ['B', 'D', 'C', 'E', 'C', 'D', 'C', 'D'],
        ['E', 'E', 'B', 'C', 'D', 'E', 'C', 'B'],
        ['C', 'D', 'E', 'A', 'B', 'C', 'D', 'E'],
        ['A', 'B', 'E', 'D', 'E', 'C', 'B', 'C'],
        ['B', 'E', 'A', 'E', 'E', 'D', 'E', 'A'],
        ['B', 'C', 'A', 'E', 'A', 'B', 'C', 'D'] 
      ];
    });

    // Add tests for a valid swap that matches 3
    it('should recognize valid swaps with the right gem that matches 3', function() {

      cursor.row = 5;
      cursor.col = 0;

      board.swapGems('right');

      expect(board.grid[cursor.row][cursor.col]).to.eq('B');
      expect(board.grid[cursor.row + 1][cursor.col]).to.eq('E');
      expect(board.grid[cursor.row + 2][cursor.col]).to.eq('C');
    });

    it('should recognize valid swaps with the gem below that matches 3', function() {

      cursor.row = 2;
      cursor.col = 3;

      board.swapGems('down');

      expect(board.grid[cursor.row][cursor.col]).to.eq('B');
      expect(board.grid[cursor.row][cursor.col - 1]).to.eq('A');
      expect(board.grid[cursor.row][cursor.col + 1]).to.eq('C');
    });

    it('should recognize valid swaps with the gem above that matches 3', function() {

      cursor.row = 6;
      cursor.col = 2;

      board.swapGems('up');

      expect(board.grid[cursor.row][cursor.col]).to.eq('A');
      expect(board.grid[cursor.row][cursor.col + 1]).to.eq('D');
      expect(board.grid[cursor.row][cursor.col + 2]).to.eq('E');
    });

    it('should recognize valid swaps with the left gem that matches 3', function() {

      cursor.row = 3;
      cursor.col = 2;

      board.swapGems('left');

      expect(board.grid[cursor.row][cursor.col]).to.eq('C');
      expect(board.grid[cursor.row + 1][cursor.col]).to.eq('A');
      expect(board.grid[cursor.row + 2][cursor.col]).to.eq('C');
    });

    it('should recognize invalid swaps', function() {

      cursor.row = 2;
      cursor.col = 2;

      board.swapGems('right');

      expect(board.grid[cursor.row][cursor.col]).to.eq('C');

    });

    it('should put new gems after a completed match', function() {
      cursor.row = 5;
      cursor.col = 0;

      board.swapGems('right');

      expect(board.grid[cursor.row][cursor.col]).to.eq('B');
      expect(board.grid[cursor.row + 1][cursor.col]).to.eq('E');
      expect(board.grid[cursor.row + 2][cursor.col]).to.eq('C');

      board.grid.forEach(row => {
        expect(row.every(gem => gem !== ' ')).to.be.true;
      });
    });

    // Add tests for swaps that set up combos
    it('should recognize swaps that set up combos', function() {

      cursor.row = 3;
      cursor.col = 5;

      board.swapGems('right');

      expect(board.grid[cursor.row + 3][cursor.col]).to.eq('A');
      expect(board.grid[cursor.row + 4][cursor.col]).to.eq('B');
    });

    // Add tests to check if there are no possible valid moves
    it('should check if there no possible valid moves', function() {
      board.grid = [
        ['1', '2', '3', '4', '5', '6', '7', '8'],
        ['9', 'a', 'b', 'c', 'd', 'e', 'f', 'g'],
        ['h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
        ['p', 'q', 'r', 's', 't', 'u', 'v', 'w'],
        ['x', 'y', 'z', 'A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
        ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z', '!', '@', '#'] 
      ];

      expect(Bejeweled.checkForPossibleMoves(board.grid)).to.be.false;
    });

  })

});

