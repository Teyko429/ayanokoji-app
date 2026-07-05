type MessageHandler = (msg: string) => void

export class StockfishEngine {
  private worker: Worker
  private handlers: MessageHandler[] = []

  constructor() {
    this.worker = new Worker('/stockfish/stockfish-18-lite-single.js')
    this.worker.onmessage = (e) => {
      this.handlers.forEach((h) => h(e.data))
    }
  }

  send(cmd: string) {
    this.worker.postMessage(cmd)
  }

  addMessageListener(callback: MessageHandler) {
    this.handlers.push(callback)
  }

  init() {
    this.send('uci')
  }

  setSkillLevel(level: number) {
    this.send('setoption name Skill Level value ' + level)
  }

  getBestMove(fen: string, depth: number = 10) {
    this.send('position fen ' + fen)
    this.send('go depth ' + depth)
  }

  terminate() {
    this.worker.terminate()
  }
}