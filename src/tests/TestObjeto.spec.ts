const request = require('supertest')
import * as server from '../server'
import { app } from '../server' // Certifique-se de que o caminho está correto
import { Request, Response } from 'express'
import { Cliente } from '../models/Cliente'
import { Objeto, ObjetoInstance } from '../models/Objeto'

describe('Teste da Rota incluirObejeto', () => {
  let objetoId: number

  it('Deve incluir um novo objeto com sucesso', async () => {
    const novoObjeto = {
      nome: 'Novo Objeto'
    }

    const response = await request(app)
      .post('/incluirObjeto')
      .send(novoObjeto)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.nome).toBe(novoObjeto.nome)

    objetoId = response.body.id
  })

  afterAll(async () => {
    if (objetoId) {
      await Objeto.destroy({ where: { id: objetoId } })
    }
  })
})

describe('Teste da Rota getObjetoById', () => {
  it('Deve retornar o obejeto correto quando o id é válido', async () => {
    const objeto = await Objeto.create({
      nome: 'Teste Objeto'
    })

    const idObjeto = objeto.id

    const response = await request(app).get(`/objetos/${idObjeto}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', idObjeto)
  })

  it('Deve retornar um status 404 quando o Id do objeto não existe', async () => {
    const idobjeto = 999

    const response = await request(app).get(`/objetos/${idobjeto}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Objeto não encontrado')
  })
})

describe('Teste da Rota listarObjeto', () => {
  it('Deve retornar uma lista de objetos', async () => {
    const response = await request(app).get('/objetos')

    expect(response.status).toBe(200)
    expect(response.body.objetos).toBeInstanceOf(Array)
  })

  it('Deve retornar a lista de objetos dentro de um tempo aceitável', async () => {
    const start = Date.now()
    const response = await request(app).get('/objetos')
    const duration = Date.now() - start

    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(100)
  })
})

describe('Teste da Rota excluirProduto', () => {
  let objeto: ObjetoInstance 
  beforeAll(async () => {
    objeto = await Objeto.create({ nome: 'Objeto Teste' })
  })

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await Objeto.destroy({ where: { id: objeto.id } })
  })

  it('Deve excluir um objeto existente', async () => {
    const response = await request(app).delete(`/excluirObjeto/${objeto.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Objeto excluído com sucesso'
    )

    // Verifica se o produto foi realmente excluído
    const objetoExcluido = await Objeto.findByPk(objeto.id)
    expect(objetoExcluido).toBeNull() // Deve retornar null se o produto foi excluído
  })
})

describe("Teste da Rota atualizarObjeto", () => {
  let objetoId: number;

  beforeAll(async () => {
    // Cria um produto para ser atualizado
    const objeto = await Objeto.create({
      nome: "Objeto para Atualizar"
    });
    objetoId = objeto.id;
  });

  it("Deve atualizar um objeto com sucesso", async () => {
    const objetoAtualizado = {
      nome: "Objeto Atualizado"
    };

    const response = await request(app).put(`/atualizarObjeto/${objetoId}`).send(objetoAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe(objetoAtualizado.nome);
  });

  it("Deve retornar erro ao tentar atualizar objeto inexistente", async () => {
    const objetoInexistenteId = 999999;
    const objetoAtualizado = {
      nome: "Objeto Inexistente"
    };

    const response = await request(app).put(`/atualizarObjeto/${objetoInexistenteId}`).send(objetoAtualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Objeto não encontrado");
  });

  afterAll(async () => {
    // Limpeza dos produtos criados
    await Objeto.destroy({ where: { id: objetoId } });
  });
});
