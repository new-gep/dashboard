import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import SendFunction from './helper/sendFunction';

describe('SendFunction', () => {
  const initialValues = {
    function: '',
  };

  const setup = () => {
    const setFinish = jest.fn();
    const renderResult = render(
      <Formik
        initialValues={initialValues}
        onSubmit={jest.fn()}
        validate={(values) => {
          const errors: { function?: string } = {};
          if (!values.function.trim()) {
            errors.function = 'Função é obrigatória';
          }
          return errors;
        }}
      >
        {(formik) => <SendFunction formik={formik} setFinish={setFinish} />}
      </Formik>,
    );
    return { ...renderResult, setFinish };
  };

  it('renderiza corretamente os elementos iniciais', () => {
    setup();

    // Verifica a mensagem inicial
    expect(
      screen.getByText('Para continuar escreva a função da vaga que você deseja abrir'),
    ).toBeInTheDocument();

    // Verifica o input de função
    const functionInput = screen.getByPlaceholderText('Função');
    expect(functionInput).toBeInTheDocument();
    expect(functionInput).toHaveValue('');

    // Verifica o botão Continuar
    const continueButton = screen.getByText('Continuar');
    expect(continueButton).toBeInTheDocument();
  });

  it('avança pra próxima etapa quando o campo função é preenchido', () => {
    const { setFinish } = setup();

    // Preenche o campo função
    const functionInput = screen.getByPlaceholderText('Função');
    fireEvent.change(functionInput, { target: { value: 'Desenvolvedor Frontend' } });

    // Verifica que o input foi preenchido
    expect(functionInput).toHaveValue('Desenvolvedor Frontend');

    // Clica no botão Continuar
    const continueButton = screen.getByText('Continuar');
    fireEvent.click(continueButton);

    // Verifica que setFinish(true) foi chamado
    expect(setFinish).toHaveBeenCalledWith(true);
  });

  it('não avança e mostra validação quando o campo função está vazio', () => {
    const { setFinish } = setup();

    // Clica no botão Continuar sem preencher o campo
    const continueButton = screen.getByText('Continuar');
    fireEvent.click(continueButton);

    // Verifica que setFinish não foi chamado
    expect(setFinish).not.toHaveBeenCalled();

    // Verifica que a mensagem de erro de validação aparece
    expect(screen.getByText('Função é obrigatória')).toBeInTheDocument();
  });

  it('mostra feedback de validação positiva quando o campo é preenchido', () => {
    setup();

    // Preenche o campo função
    const functionInput = screen.getByPlaceholderText('Função');
    fireEvent.change(functionInput, { target: { value: 'Desenvolvedor Frontend' } });

    // Simula o blur pra disparar a validação
    fireEvent.blur(functionInput);

    // Verifica que o feedback positivo aparece
    expect(screen.getByText('Ótimo!')).toBeInTheDocument();
  });
});