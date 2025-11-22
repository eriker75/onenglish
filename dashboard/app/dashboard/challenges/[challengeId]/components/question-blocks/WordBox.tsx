"use client";
import React, { useState } from "react";

interface WordBoxProps {
  question?: string;
  instructions?: string;
  maxWords?: number;
  width?: number;
  height?: number;
  grid?: string[][];
  points?: number;
  timeMinutes?: number;
  timeSeconds?: number;
  maxAttempts?: number;
  onQuestionChange?: (question: string) => void;
  onInstructionsChange?: (instructions: string) => void;
  onMaxWordsChange?: (maxWords: number) => void;
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
  onGridChange?: (grid: string[][]) => void;
  onPointsChange?: (points: number) => void;
  onTimeMinutesChange?: (minutes: number) => void;
  onTimeSecondsChange?: (seconds: number) => void;
  onMaxAttemptsChange?: (attempts: number) => void;
}

export default function WordBox({
  question = "",
  instructions = "",
  maxWords: initialMaxWords = 1,
  width: initialWidth = 3,
  height: initialHeight = 3,
  grid: initialGrid,
  points: initialPoints = 0,
  timeMinutes: initialTimeMinutes = 0,
  timeSeconds: initialTimeSeconds = 0,
  maxAttempts: initialMaxAttempts = 1,
  onQuestionChange,
  onInstructionsChange,
  onMaxWordsChange,
  onWidthChange,
  onHeightChange,
  onGridChange,
  onPointsChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onMaxAttemptsChange,
}: WordBoxProps) {
  const [questionText, setQuestionText] = useState(
    question || "Use the letters in the grid to form the correct word"
  );
  const [instructionsText, setInstructionsText] = useState(instructions);
  const [maxWordsValue, setMaxWordsValue] = useState(initialMaxWords);
  const [widthValue, setWidthValue] = useState(initialWidth);
  const [heightValue, setHeightValue] = useState(initialHeight);
  const [pointsValue, setPointsValue] = useState(initialPoints);
  const [timeMinutesValue, setTimeMinutesValue] = useState(initialTimeMinutes);
  const [timeSecondsValue, setTimeSecondsValue] = useState(initialTimeSeconds);
  const [maxAttemptsValue, setMaxAttemptsValue] = useState(initialMaxAttempts);

  // Initialize grid
  const initializeGrid = (
    w: number,
    h: number,
    existingGrid?: string[][]
  ): string[][] => {
    if (
      existingGrid &&
      existingGrid.length === h &&
      existingGrid[0]?.length === w
    ) {
      return existingGrid.map((row) => [...row]);
    }
    return Array(h)
      .fill(null)
      .map(() => Array(w).fill(""));
  };

  const [grid, setGrid] = useState<string[][]>(() =>
    initializeGrid(initialWidth, initialHeight, initialGrid)
  );

  const handleQuestionChange = (value: string) => {
    setQuestionText(value);
    onQuestionChange?.(value);
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsText(value);
    onInstructionsChange?.(value);
  };

  const handlePointsChange = (value: number) => {
    const points = Math.max(0, value);
    setPointsValue(points);
    onPointsChange?.(points);
  };

  const handleTimeMinutesChange = (value: number) => {
    const minutes = Math.max(0, Math.floor(value));
    setTimeMinutesValue(minutes);
    onTimeMinutesChange?.(minutes);
  };

  const handleTimeSecondsChange = (value: number) => {
    const seconds = Math.max(0, Math.min(59, Math.floor(value)));
    setTimeSecondsValue(seconds);
    onTimeSecondsChange?.(seconds);
  };

  const handleMaxAttemptsChange = (value: number) => {
    const attempts = Math.max(1, Math.floor(value));
    setMaxAttemptsValue(attempts);
    onMaxAttemptsChange?.(attempts);
  };

  const handleMaxWordsChange = (value: number) => {
    const maxWords = Math.max(1, Math.floor(value));
    setMaxWordsValue(maxWords);
    onMaxWordsChange?.(maxWords);
  };

  const handleWidthChange = (value: number) => {
    const newWidth = Math.max(1, Math.min(20, value));
    setWidthValue(newWidth);
    onWidthChange?.(newWidth);

    // Resize grid columns
    const newGrid = grid.map((row) => {
      const newRow = [...row];
      if (newWidth > row.length) {
        // Add empty cells
        while (newRow.length < newWidth) {
          newRow.push("");
        }
      } else {
        // Remove cells
        newRow.splice(newWidth);
      }
      return newRow;
    });
    setGrid(newGrid);
    onGridChange?.(newGrid);
  };

  const handleHeightChange = (value: number) => {
    const newHeight = Math.max(1, Math.min(20, value));
    setHeightValue(newHeight);
    onHeightChange?.(newHeight);

    // Resize grid rows
    const newGrid = [...grid];
    if (newHeight > grid.length) {
      // Add empty rows
      while (newGrid.length < newHeight) {
        newGrid.push(Array(widthValue).fill(""));
      }
    } else {
      // Remove rows
      newGrid.splice(newHeight);
    }
    setGrid(newGrid);
    onGridChange?.(newGrid);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    // Only allow single uppercase letter or empty
    const letter = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 1);

    const newGrid = grid.map((r, rIdx) =>
      rIdx === row ? r.map((c, cIdx) => (cIdx === col ? letter : c)) : r
    );
    setGrid(newGrid);
    onGridChange?.(newGrid);

    // Auto-advance to next cell if a letter was entered
    if (letter) {
      setTimeout(() => {
        let nextRow = row;
        let nextCol = col + 1;

        // If at the end of the row, move to the next row
        if (nextCol >= widthValue) {
          nextRow = row + 1;
          nextCol = 0;
        }

        // Only advance if there's a next row
        if (nextRow < heightValue) {
          const nextInput = document.getElementById(
            `cell-${nextRow}-${nextCol}`
          ) as HTMLInputElement;
          nextInput?.focus();
          nextInput?.select();
        }
      }, 10);
    }
  };

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const isEmpty = !grid[row]?.[col];

      // Clear current cell
      handleCellChange(row, col, "");

      // If cell was already empty or we just cleared it, move to previous cell
      if (isEmpty || e.key === "Backspace") {
        setTimeout(() => {
          let prevRow = row;
          let prevCol = col - 1;

          // If at the beginning of the row, move to the previous row
          if (prevCol < 0) {
            prevRow = row - 1;
            prevCol = widthValue - 1;
          }

          // Only move back if there's a previous row
          if (prevRow >= 0) {
            const prevInput = document.getElementById(
              `cell-${prevRow}-${prevCol}`
            ) as HTMLInputElement;
            prevInput?.focus();
            prevInput?.select();
          }
        }, 10);
      }
    } else if (e.key === "ArrowRight" && col < widthValue - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(
        `cell-${row}-${col + 1}`
      ) as HTMLInputElement;
      nextInput?.focus();
    } else if (e.key === "ArrowLeft" && col > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(
        `cell-${row}-${col - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    } else if (e.key === "ArrowDown" && row < heightValue - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(
        `cell-${row + 1}-${col}`
      ) as HTMLInputElement;
      nextInput?.focus();
    } else if (e.key === "ArrowUp" && row > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(
        `cell-${row - 1}-${col}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Enter the question text..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <input
            type="text"
            value={instructionsText}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="Enter instructions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Words *
          </label>
          <input
            type="number"
            min="1"
            value={maxWordsValue}
            onChange={(e) => handleMaxWordsChange(parseInt(e.target.value) || 1)}
            placeholder="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Minutes) *
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={timeMinutesValue}
            onChange={(e) =>
              handleTimeMinutesChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Minutes to answer</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time (Seconds) *
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={timeSecondsValue}
            onChange={(e) =>
              handleTimeSecondsChange(parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Additional seconds (0-59)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points *
          </label>
          <input
            type="number"
            min="0"
            value={pointsValue}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Points awarded for correct answer
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Attempts *
          </label>
          <input
            type="number"
            min="1"
            value={maxAttemptsValue}
            onChange={(e) =>
              handleMaxAttemptsChange(parseInt(e.target.value) || 1)
            }
            placeholder="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of attempts allowed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* First Column (1/4): Width and Height */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Word Box Width (columns) *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={widthValue}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of columns in the word box grid
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Word Box Height (rows) *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={heightValue}
              onChange={(e) =>
                handleHeightChange(parseInt(e.target.value) || 1)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#44b07f] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of rows in the word box grid
            </p>
          </div>
        </div>

        {/* Columns 2-4 (3/4): Grid */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Word Box Grid ({widthValue} x {heightValue}) *
            </label>
            <button
              onClick={() => {
                const emptyGrid = initializeGrid(widthValue, heightValue);
                setGrid(emptyGrid);
                onGridChange?.(emptyGrid);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear Grid
            </button>
          </div>
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-300"
              style={{
                gridTemplateColumns: `repeat(${widthValue}, minmax(50px, 1fr))`,
              }}
            >
              {Array.from({ length: heightValue }).map((_, rowIdx) =>
                Array.from({ length: widthValue }).map((_, colIdx) => (
                  <input
                    key={`${rowIdx}-${colIdx}`}
                    id={`cell-${rowIdx}-${colIdx}`}
                    type="text"
                    value={grid[rowIdx]?.[colIdx] || ""}
                    onChange={(e) =>
                      handleCellChange(rowIdx, colIdx, e.target.value)
                    }
                    onKeyDown={(e) => handleCellKeyDown(e, rowIdx, colIdx)}
                    maxLength={1}
                    className="w-12 h-12 min-w-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#44b07f] focus:ring-2 focus:ring-[#44b07f]/20 focus:outline-none bg-white uppercase transition-colors"
                    placeholder=""
                    autoComplete="off"
                  />
                ))
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click on each cell to enter a letter. Use arrow keys to navigate
            between cells.
          </p>
        </div>
      </div>

      {/* AI Validation Info */}
      <div className="bg-[#33CC00]/10 border border-[#33CC00] rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong className="text-[#33CC00]">AI-Powered Validation:</strong> Students will construct words from the letters in the grid. The system will automatically validate if the constructed word matches the correct answer using AI. No manual answer checking required.
        </p>
      </div>
    </div>
  );
}
