import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

const ECommerce: React.FC = () => {
  return (
    <DefaultLayout>
      <header>
        <img src="./assets/logo.svg" alt="logo dev.finance$" />
      </header>

      <main className="container">
        <section id="balance">
          <h2 className="sr-only">Balanço</h2>
          <div className="card">
            <h3>
              <span>Entradas</span>
              <img src="./assets/income.svg" alt="Imagem de entradas" />
            </h3>
            <p id="incomeDisplay">R$ 0,00</p>
          </div>
          <div className="card">
            <h3>
              <span>Saídas</span>
              <img src="./assets/expense.svg" alt="Imagem de saídas" />
            </h3>
            <p id="expenseDisplay">R$ 0,00</p>
          </div>
          <div className="card total">
            <h3>
              <span>Total</span>
              <img src="./assets/total.svg" alt="Imagem de total" />
            </h3>
            <p id="totalDisplay">R$ 0,00</p>
          </div>
        </section>

        <section id="transaction">
          <h2 className="sr-only">Transações</h2>

          {/* Substituído pelo FloatButton */}
          {/* <a href="#" onClick={Modal.open} className="button new">+ Nova Transação</a> */}

          <table id="data-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{/* Coloque suas transações aqui, se necessário */}</tbody>
          </table>
        </section>
      </main>

      <div className="modal-overlay">
        <div className="modal">
          <div id="form">
            <h2>Nova Transação</h2>

            <form action="" onSubmit={Form.submit}>
              <div className="input-group">
                <label htmlFor="description" className="sr-only">
                  Descrição
                </label>
                <input type="text" id="description" name="description" placeholder="Descrição" />
              </div>

              <div className="input-group">
                <label htmlFor="amount" className="sr-only">
                  Valor
                </label>
                <input type="number" id="amount" name="amount" placeholder="0,00" step="0.01" />
              </div>

              <small className="help-for-modal">Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais</small>

              <div className="input-group">
                <label htmlFor="date" className="sr-only">
                  Data
                </label>
                <input type="date" id="date" name="date" />
              </div>

              <div className="input-group actions">
                <a href="#" onClick={Modal.close} className="button cancel">
                  Cancelar
                </a>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="toast">
        <div className="img">
          <h1>×</h1>
        </div>
        <div className="description">Por favor, preencha todos os campos!</div>
      </div>

      <a href="#" onClick={Modal.open} className="float-button">
        <img src="./assets/float-plus.svg" alt="Adicionar" width="16px" />
      </a>

      <footer>
        <small>© 2021 - dev.finance$</small>
      </footer>

      <script src="./scripts/index.js" type="text/javascript" />
      {/* O restante do seu script Firebase vai aqui */}
    </DefaultLayout>
  );
};

export default ECommerce;
