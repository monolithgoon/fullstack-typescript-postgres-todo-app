type ErrorMessageType = {
  message: string;
};

// Define a function that checks whether an `unknown` input is an `ErrorWithMessage` object
function hasErrorMessageProperty(error: unknown): error is ErrorMessageType {
  // Check that `error` is an object, not null, and has a `message` property
  // Also check that the `message` property is a string
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    // This line checks whether the message property of an unknown input object is a string.
    // The as keyword is used to cast error to a Record<string, unknown> type, which is a type that describes an object with string keys and values of unknown type.
    // This casting allows TypeScript to recognize the message property as a key on the object and check its type.
    typeof (error as Record<string, unknown>).message === "string"
  );
}

// Define a function that returns an `ErrorWithMessage` object given an `unknown` input
function getErrorObjectWithMessage(maybeError: unknown): ErrorMessageType {
  // Check if `maybeError` is already an `ErrorWithMessage`
  // If it is, return it

  if (hasErrorMessageProperty(maybeError)) {
    return maybeError;
  }

  try {
    // Try to stringify `maybeError` using `JSON.stringify`
    // If successful, return a new `ErrorWithMessage` object with the stringified `maybeError` as its `message` property
    return new Error(JSON.stringify(maybeError));
  } catch {
    // If `JSON.stringify` throws an error (e.g. if `maybeError` contains circular references), return a new `Error` object with `maybeError` stringified using `String` as its `message` property
    return new Error(String(maybeError));
  }
}

// Define a function that returns the `message` property of an `ErrorWithMessage` object
function getErrorMessage(error: unknown): string {
  // Call `getErrorObjectWithMessage` on `error` to ensure that it is an `ErrorWithMessage` object
  // Then return the `message` property of the resulting `ErrorWithMessage` object
  return getErrorObjectWithMessage(error).message;
}

export const logErrorWithContext = (error: unknown, contextMessage: string | null) => {
  
  const errorMessage = getErrorMessage(getErrorObjectWithMessage(error));

  if (!contextMessage) {
    console.log(`An error occurred: ${errorMessage}`);
  } else {
    console.log(`${contextMessage}: ${errorMessage}`);
  }

  console.log({ error });
};
