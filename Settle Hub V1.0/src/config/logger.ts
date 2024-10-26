// import chalk from 'chalk';

// interface CustomLogger {
//   info(...args: any[]): void;
//   error(...args: any[]): void;
//   warn(...args: any[]): void;
// }

// class Logger implements CustomLogger {
//   private chalkInstance: any;

//   constructor() {
//     this.chalkInstance = chalk;
//   }

//   public info(...args: any[]): void {
//     console.warn(
//       this.chalkInstance.blue(this.formatMessage('INFO', ...args))
//     );
//   }
//   public error(...args: any[]): void {
//     console.error(
//       this.chalkInstance.red(this.formatMessage('ERROR', ...args))
//     );
//   }
//   public warn(...args: any[]): void {
//     console.warn(
//       this.chalkInstance.yellow(this.formatMessage('WARN', ...args))
//     );
//   }

//   private formatMessage(level: string, ...args: any[]): string {
//     const timestamp = new Date().toISOString();
//     return `[${timestamp}] [${level}]: ${args.join(' ')}`;
//   }
// }
