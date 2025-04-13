// Export tables first
export * from './roles';
export * from './users';
export * from './chat-profiles';

// Then export relations (optional, but can be convenient)
// You might need to be careful with naming conflicts if relations are also exported
// Often, just exporting the tables is enough, and relations are used within their definition files.
