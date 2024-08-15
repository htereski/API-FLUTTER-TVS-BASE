import { Request, Response } from "express";
import { Op } from "sequelize";
import { Objeto } from "../models/Objeto";

export const listarObjetos = async (req: Request, res: Response) => {
  try {
    const objetos = await Objeto.findAll();
    res.json({ objetos });
  } catch (error) {
    console.error("Erro ao listar objetos:", error);
    res.status(500).json({ message: "Erro ao listar objetos" });
  }
};

export const getObjetoById = async (req: Request, res: Response) => {
  try {
    const objetoId = parseInt(req.params.idObjeto, 10);
    const objetos = await Objeto.findByPk(objetoId);

    if (objetos) {
      res.json(objetos);
    } else {
      res.status(404).json({ message: "Objeto não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar objeto:", error);
    res.status(500).json({ message: "Erro ao buscar objeto" });
  }
};

export const excluirObjeto = async (req: Request, res: Response) => {
  try {
    const objetoId = parseInt(req.params.idObjeto, 10);

    const objeto = await Objeto.findByPk(objetoId);
    if (!objeto) {
      return res.status(404).json({ message: "Objeto não encontrado" });
    }

    await objeto.destroy();
    res.json({ message: "Objeto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir objeto:", error);
    res.status(500).json({ message: "Erro ao excluir objeto" });
  }
};

export const atualizarObjeto = async (req: Request, res: Response) => {
  try {
    const objetoId = parseInt(req.params.idObjeto, 10);
    const { nome } = req.body;

    const objeto = await Objeto.findByPk(objetoId);

    if (objeto) {
      await objeto.update({ nome });
      res.json(objeto);
    } else {
      res.status(404).json({ message: "Objeto não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar objeto:", error);
    res.status(500).json({ message: "Erro ao atualizar objeto" });
  }
};

export const incluirObjeto = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;

    const novoObjeto = await Objeto.create({ nome });

    res.status(201).json(novoObjeto);
  } catch (error) {
    console.error("Erro ao incluir objeto:", error);
    res.status(500).json({ message: "Erro ao incluir objeto" });
  }
};
