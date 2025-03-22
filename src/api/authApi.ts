import axios from 'axios';

const HOST = 'https://test.v5.pryaniky.com';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${HOST}/ru/data/v3/testmethods/docs/login`, {
      username,
      password,
    });
    return response.data.data.token;
  } catch {
    throw new Error('Ошибка авторизации');
  }
};
