import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

function runHelp() {
  return [
    'Available commands:',
    '  help     - Show this list',
    '  about   - About me',
    '  projects - My projects',
    '  skills   - My skills',
    '  contact  - How to reach me',
    '  clear    - Clear terminal history',
  ].join('\n');
}

function runAbout() {
  return "I'm a developer building web apps. More about me on the Home page.";
}

function runProjects() {
  return 'Check the Projects page for my work. (API data can be shown here in v2.)';
}

function runSkills() {
  return 'React, Node.js, MongoDB, and more. See the Skills page.';
}

function runContact() {
  return 'Reach me via the Contact page — email, GitHub, LinkedIn.';
}

function parseCommand(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const firstWord = trimmed.split(/\s+/)[0];
  return firstWord.toLowerCase();
}

function executeCommand(command) {
  switch (command) {
    case 'help':
      return runHelp();
    case 'about':
      return runAbout();
    case 'projects':
      return runProjects();
    case 'skills':
      return runSkills();
    case 'contact':
      return runContact();
    default:
      return "Command not found. Type 'help'.";
  }
}

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentInput]);

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const command = parseCommand(currentInput);
    if (command === 'clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    }
    if (!command) return;
    const output = executeCommand(command);
    setHistory((prev) => [...prev, { command: currentInput.trim(), output }]);
    setCurrentInput('');
  }

  function handleTerminalClick() {
    inputRef.current?.focus();
  }

  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mb-4 text-4xl font-bold text-text">Terminal</h1>
        <p className="mb-8 text-lg text-text-muted">
          Type a command and press Enter. Try &quot;help&quot; to get started.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="overflow-hidden rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-medium text-gray-400">terminal</div>
            <div className="w-16"></div>
          </div>

          <div
            onClick={handleTerminalClick}
            role="application"
            aria-label="Terminal"
            className="min-h-[420px] cursor-text bg-black p-6 font-mono text-sm"
          >
            <div
              className="terminal-v1-scroll pr-2"
              ref={scrollRef}
            >
              {history.length === 0 && (
                <div className="mb-4 text-green-500">
                  <p>Welcome to Portfolio Terminal v1.0.0</p>
                  <p className="mt-1 text-green-400/70">Type &quot;help&quot; for available commands.</p>
                </div>
              )}
              {history.map((entry, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-500">guest@portfolio</span>
                    <span className="text-green-400">:</span>
                    <span className="font-bold text-blue-400">~</span>
                    <span className="text-green-500">$</span>
                    <span className="text-green-300">{entry.command}</span>
                  </div>
                  <div className="ml-1 mt-1 whitespace-pre-wrap break-words text-green-400/90">
                    {entry.output}
                  </div>
                </div>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-green-500">guest@portfolio</span>
                <span className="text-green-400">:</span>
                <span className="font-bold text-blue-400">~</span>
                <span className="text-green-500">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-v1-input flex-1 min-w-0"
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                  aria-label="Command input"
                />
                <span className="cursor-blink ml-0.5 inline-block h-5 w-2 bg-green-500"></span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
