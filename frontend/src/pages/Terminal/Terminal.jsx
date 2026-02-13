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
        <h1 className="mb-2 text-3xl font-bold text-text">Terminal</h1>
        <p className="mb-4 text-text-muted">
          Type a command and press Enter. Try &quot;help&quot;.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onClick={handleTerminalClick}
          role="application"
          aria-label="Terminal"
          className="min-h-[320px] cursor-text overflow-hidden rounded-xl border border-slate-600 bg-slate-900 p-4 font-mono text-sm text-slate-200 shadow-lg"
        >
          <div
            className="terminal-v1-scroll max-h-[400px] overflow-y-auto pr-2"
            ref={scrollRef}
          >
            {history.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">$</span>
                  <span>{entry.command}</span>
                </div>
                <div className="ml-5 whitespace-pre-wrap break-words text-slate-300">
                  {entry.output}
                </div>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-emerald-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-v1-input flex-1 min-w-0 bg-transparent outline-none placeholder:text-slate-500"
                spellCheck={false}
                autoComplete="off"
                autoFocus
                aria-label="Command input"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
