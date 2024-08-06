const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Pedido } from "../models/Pedido";
import { Cliente } from "../models/Cliente";
import { format, parseISO } from "date-fns"; //lib para a formatação das horas

describe("Teste da Rota incluirPedido", () => {
  let pedidoId: number;
  let clienteId: number;

  beforeAll(async () => {
    // Cria um cliente para associar ao pedido
    const cliente = await Cliente.create({
      nome: "Cliente Teste",
      sobrenome: "Sobrenome Teste",
      cpf: "12345678900"
    });
    clienteId = cliente.id;
  });

  it("Deve incluir um novo pedido com sucesso", async () => {
    const novoPedido = {
      data: "2024-08-01",
      id_cliente: clienteId
    };

    const response = await request(app).post("/incluirPedido").send(novoPedido);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id_cliente).toBe(novoPedido.id_cliente);

    pedidoId = response.body.id; // Armazena o ID do pedido recém-criado para limpeza posterior
  });

  afterAll(async () => {
    // Remove o pedido e o cliente criado no teste
    if (pedidoId) {
      await Pedido.destroy({ where: { id: pedidoId } });
    }
    if (clienteId) {
      await Cliente.destroy({ where: { id: clienteId } });
    }
  });
});

describe("Teste da Rota getPedidoById", () => {
  it("Deve retornar o pedido correto quando o id é válido", async () => {
    const idPedido = 1; // Supondo que este seja um ID válido existente no seu banco de dados
    const response = await request(app).get(`/pedidos/${idPedido}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("pedido.id", idPedido);
  });

  it("Deve retornar um status 404 quando o Id do pedido não existe", async () => {
    const idPedido = 999;

    const response = await request(app).get(`/pedidos/${idPedido}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Pedido não encontrado");
  });
});

describe("Teste da Rota listarPedidos", () => {
  it("Deve retornar uma lista de pedidos", async () => {
    const response = await request(app).get("/pedidos");

    expect(response.status).toBe(200);
    expect(response.body.pedidos).toBeInstanceOf(Array);
  });

  it("Deve retornar a lista de pedidos dentro de um tempo aceitável", async () => {
    const start = Date.now();
    const response = await request(app).get("/pedidos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 100ms
  });
});

describe("Teste da Rota excluirPedido", () => {
  let pedidoId: number;
  let clienteId: number;

  beforeAll(async () => {
    // Cria um cliente e um pedido para o teste de exclusão
    const cliente = await Cliente.create({
      nome: "Cliente Teste",
      sobrenome: "Sobrenome Teste",
      cpf: "12345678900"
    });
    clienteId = cliente.id;

    const pedido = await Pedido.create({
      data: "2024-08-01",
      id_cliente: clienteId
    });
    pedidoId = pedido.id;
  });

  afterAll(async () => {
    // Limpa o cliente criado no teste
    await Cliente.destroy({ where: { id: clienteId } });
  });

  it("Deve excluir um pedido existente", async () => {
    // Faz a requisição para excluir o pedido com ID especificado
    const response = await request(app).delete(`/excluirPedido/${pedidoId}`);

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Pedido excluído com sucesso");

    // Verifica se o pedido foi realmente excluído
    const pedidoExcluido = await Pedido.findByPk(pedidoId);
    expect(pedidoExcluido).toBeNull(); // Deve retornar null se o pedido foi excluído
  });
});

describe("Teste da Rota atualizarPedido", () => {
  let pedidoId: number;
  let clienteId: number;

  beforeAll(async () => {
    // Cria um cliente e um pedido para ser atualizado
    const cliente = await Cliente.create({
      nome: "Cliente Teste",
      sobrenome: "Sobrenome Teste",
      cpf: "12345678900"
    });
    clienteId = cliente.id;

    const pedido = await Pedido.create({
      data: "2024-08-01T00:00:00Z", // Garantir o formato ISO para consistência
      id_cliente: clienteId
    });
    pedidoId = pedido.id;
  });

  it("Deve atualizar um pedido com sucesso", async () => {
    const pedidoAtualizado = {
      data: "2024-08-02T00:00:00Z", // Adiciona tempo na data esperada
      id_cliente: clienteId
    };

    const response = await request(app).put(`/atualizarPedido/${pedidoId}`).send(pedidoAtualizado);

    expect(response.status).toBe(200);

    // Formatar a data recebida para garantir que estamos comparando apenas a parte da data
    const responseDate = format(parseISO(response.body.data), "yyyy-MM-dd");
    const expectedDate = format(parseISO(pedidoAtualizado.data), "yyyy-MM-dd");

    expect(responseDate).toBe(expectedDate);
  });

  it("Deve retornar erro ao tentar atualizar pedido inexistente", async () => {
    const pedidoInexistenteId = 999999;
    const pedidoAtualizado = {
      data: "2024-08-02T00:00:00Z",
      id_cliente: clienteId
    };

    const response = await request(app).put(`/atualizarPedido/${pedidoInexistenteId}`).send(pedidoAtualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Pedido não encontrado");
  });

  afterAll(async () => {
    // Limpeza dos pedidos e clientes criados
    await Pedido.destroy({ where: { id: pedidoId } });
    await Cliente.destroy({ where: { id: clienteId } });
  });
});
