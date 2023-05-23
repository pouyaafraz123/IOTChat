export const createError = (message: string, code: number, data?: { [key: string]: string }[]) => {
  let error: any = new Error(message);
  error.code = code;
  error.data = data;
  throw error;
};
