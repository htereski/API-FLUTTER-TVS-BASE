import { Request, Response } from "express";
import { Produto } from "../models/Produto";
import { Cliente } from "../models/Cliente";
import { Pedido } from "../models/Pedido";
import { ItemDoPedido } from "../models/ItemDoPedido";

// Listar todos os pedidos e retornar objetos separados para pedido e cliente
export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
          as: "Cliente" // Use o alias correto aqui
        }
      ]
    });

    // Formata a resposta para separar os objetos de pedido e cliente
    const pedidosFormatados = pedidos.map((pedido) => ({
      pedido: {
        id: pedido.id, // Inclui o id do pedido
        data: pedido.data // Inclui a data do pedido
      },
      cliente: pedido.Cliente
        ? {
            id: pedido.Cliente.id,
            nome: pedido.Cliente.nome,
            sobrenome: pedido.Cliente.sobrenome,
            cpf: pedido.Cliente.cpf
          }
        : null
    }));

    res.json({ pedidos: pedidosFormatados });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ message: "Erro ao listar pedidos" });
  }
};

// Buscar pedido por ID e retornar objetos separados para pedido e cliente
export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.idPedido, 10);
    const pedido = await Pedido.findByPk(pedidoId, {
      include: [
        {
          model: Cliente,
          as: "Cliente" // Use o alias correto aqui
        }
      ]
    });

    if (pedido) {
      const response = {
        pedido: {
          id: pedido.id,
          data: pedido.data
        },
        cliente: pedido.Cliente
          ? {
              id: pedido.Cliente.id,
              nome: pedido.Cliente.nome,
              sobrenome: pedido.Cliente.sobrenome,
              cpf: pedido.Cliente.cpf
            }
          : null
      };

      res.json(response);
    } else {
      res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
};

// Incluir um novo pedido
export const incluirPedido = async (req: Request, res: Response) => {
  try {
    const { data, id_cliente } = req.body;
    const novoPedido = await Pedido.create({ data, id_cliente });

    res.status(201).json(novoPedido);
  } catch (error) {
    console.error("Erro ao incluir pedido:", error);
    res.status(500).json({ message: "Erro ao incluir pedido" });
  }
};

// Atualizar um pedido existente
export const atualizarPedido = async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const { data, id_cliente } = req.body;

    const pedido = await Pedido.findByPk(pedidoId);

    if (pedido) {
      await pedido.update({ data, id_cliente });
      res.json(pedido);
    } else {
      res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({ message: "Erro ao atualizar pedido" });
  }
};

// Excluir um pedido existente
export const excluirPedido = async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const pedido = await Pedido.findByPk(pedidoId);

    if (pedido) {
      await pedido.destroy();
      res.json({ message: "Pedido excluído com sucesso" });
    } else {
      res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    res.status(500).json({ message: "Erro ao excluir pedido" });
  }
};
