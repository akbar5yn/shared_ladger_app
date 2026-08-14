
export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  const { apiBase } = useRuntimeConfig().public;

  const laravelEndpoint = `${apiBase}/auth/login`;

  try {
    const response = await $fetch(laravelEndpoint, {
      method: "POST",
      body: credentials,
    });
    return response;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: unknown }; message?: string };
    const status = err.response?.status || 500;
    setResponseStatus(event, status);
    return {
      error: err.message ?? 'Login request failed',
      statusCode: status,
    };
  }
});
