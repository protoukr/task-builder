export class IllegalOperationError extends Error {
  constructor(op: string, validOperations: string[]) {
    const ops = validOperations.join(', ');
    super(`Illegal operation ${op}. The legal ones are: ${ops}`);
    this.name = 'IllegalOperationError';
  }
}
