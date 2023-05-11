export const logErrorWithContext = (error: unknown, contextMessage: string | null) => {
  if (!contextMessage) {
    if (error instanceof Error) {
      console.log(`An error occurred: ${error.message}`);
    } else {
      console.log(`An error occurred: ${String(error)}`);
    }
  } else {
    if (error instanceof Error) {
      console.log(`${contextMessage}: ${error.message}`);
    } else {
      console.log(`${contextMessage}: ${String(error)}`);
    }
  }
  console.log({ error });
};
