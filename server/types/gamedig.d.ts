declare module 'gamedig' {
  export interface QueryOptions {
    type: string;
    host: string;
    port: number;
    maxAttempts?: number;
    attemptTimeout?: number;
  }

  export interface Player {
    name: string;
    raw?: Record<string, any>;
  }

  export interface QueryResult {
    name: string;
    map: string;
    password: boolean;
    maxplayers: number;
    players: Player[];
    bots: Player[];
    connect: string;
    ping: number;
    raw?: Record<string, any>;
  }

  export const Gamedig: {
    query: (options: QueryOptions) => Promise<QueryResult>;
  };

  export default Gamedig;
}