const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const backendPath = path.join(__dirname, '..', 'finhance-backend');

function spawnBackendPython(args, options = {}) {
  const executable = process.platform === 'win32'
    ? path.join('Scripts', 'python.exe')
    : path.join('bin', 'python');
  const localPython = path.join(backendPath, '.venv', executable);
  return spawn(existsSync(localPython) ? localPython : 'python', args, {
    cwd: backendPath,
    ...options,
  });
}

if (require.main === module) {
  const child = spawnBackendPython(['start.py'], { stdio: 'inherit' });
  child.on('error', (error) => {
    console.error(`Не удалось запустить Python. Проверьте виртуальную среду backend: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });
}

module.exports = { backendPath, spawnBackendPython };
