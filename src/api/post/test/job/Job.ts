import axios from 'axios';
import Job from '../../Job';

// Fazendo mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Job API Function', () => {
  it('deve fazer um POST com os dados corretos e retornar a resposta', async () => {
    const fakeData = { success: true };
   
    const formData = {
      benefits: 'VT, VR',
      contract: 'CLT',
      details: 'Detalhes do trabalho',
      image: 'https://imagem.com',
      function: 'Desenvolvedor',
      obligations: 'Desenvolver e manter sistemas',
      salary: '5000',
      time: { start: '09:00', end: '18:00' },
      user_update: 'admin@example.com'
    };

    // Simulando que o axios.post vai retornar sucesso
    mockedAxios.post.mockResolvedValueOnce({ data: fakeData });
    const response = await Job(formData);

    // Verifica se chamou axios.post corretamente
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API}job`,
      formData
    );

    // Verifica se a resposta é o que esperamos
    expect(response).toEqual(fakeData);
  });

  it('deve tratar erro caso o POST falhe', async () => {
    const formData = {
      function: 'Desenvolvedor',
      obligations: 'Desenvolver e manter sistemas',
      salary: '5000',
      time: {},
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    mockedAxios.post.mockRejectedValueOnce(new Error('Erro de rede'));

    await Job(formData);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });
});
