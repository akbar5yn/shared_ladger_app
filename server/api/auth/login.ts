
export default defineEventHandler(async (event) => {
  const credentials = await readBody(event);

  const { apiBase } = useRuntimeConfig().public;

  const laravelEndpoint = `${apiBase}/login`;

  try {
    const response = await $fetch(laravelEndpoint, {
      method: "POST",
      body: credentials,
    });
    return response;
  } catch (error: any) {
    setResponseStatus(event, error.response?.status || 500);
    return {
      error: error.message,
      statusCode: error.response?.status || 500,
    };
  }
});
