const request = require('supertest')
import * as server from '../server'
import { app } from '../server' // Certifique-se de que o caminho está correto
import { Request, Response } from 'express'
import { Cliente, ClienteInstance } from '../models/Cliente'

describe('Teste da Rota incluirCliente', () => {
  let clienteId: number

  it('Deve incluir um novo cliente com sucesso', async () => {
    const novoCliente = {
      nome: 'Novo',
      sobrenome: 'Cliente',
      cpf: '11111111111'
    }

    const response = await request(app)
      .post('/incluirCliente')
      .send(novoCliente)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.nome).toBe(novoCliente.nome)
    expect(response.body.sobrenome).toBe(novoCliente.sobrenome)
    expect(response.body.cpf).toBe(novoCliente.cpf)

    clienteId = response.body.id // Armazena o ID do cliente recém-criado para limpeza posterior
  })

  it('Deve retornar erro ao tentar incluir um cliente com CPF já existente', async () => {
    const clienteExistente = {
      nome: 'Existente',
      sobrenome: 'Cliente',
      cpf: '11111111111'
    }

    // Tenta incluir um cliente com CPF já existente
    const response = await request(app)
      .post('/incluirCliente')
      .send(clienteExistente)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'CPF já cadastrado')
  })

  afterAll(async () => {
    // Remove o cliente criado no teste
    if (clienteId) {
      await Cliente.destroy({ where: { id: clienteId } })
    }
  })
})

describe('Teste da Rota GetClienteById', () => {
  it('Deve retornar o cliente correto quando o id é valido', async () => {
    const novoCliente = {
      nome: 'Teste',
      sobrenome: 'Cliente',
      cpf: '22222222222'
    }
    let cliente = await Cliente.create(novoCliente)

    const response = await request(app).get(`/clientes/${cliente.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', cliente.id)
  })

  it('Deve retornar um status 404 quando o Id do cliente nao existe', async () => {
    const idCliente = 0

    const response = await request(app).get(`/clientes/${idCliente}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Cliente não encontrado')
  })
})

describe('Teste da Rota listarClientes', () => {
  it('Deve retornar uma lista de clientes', async () => {
    const cliente1 = {
      nome: 'Novo',
      sobrenome: 'Cliente',
      cpf: '11111111111'
    }

    const cliente2 = {
      nome: 'Teste',
      sobrenome: 'Cliente',
      cpf: '00000000000'
    }

    await request(app).post('/incluirCliente').send(cliente1)
    await request(app).post('/incluirCliente').send(cliente2)

    const response = await request(app).get('/clientes')

    expect(response.status).toBe(200)
    expect(response.body.clientes).toBeInstanceOf(Array)
  })

  it('Deve retornar uma lista vazia de clientes', async () => {
    
    const clientes = await Cliente.findAll()

    for (const cliente of clientes) {
      await cliente.destroy();
  }

    const response = await request(app).get('/clientes')

    console.log("clientes: " + JSON.stringify(response.body))

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Nenhum cliente encontrado')
  })

  it('Deve retornar a lista de clientes dentro de um tempo aceitavel', async () => {
    const start = Date.now()
    const response = await request(app).get('/clientes')
    const duration = Date.now() - start

    expect([200, 404]).toContain(response.status)
    expect(duration).toBeLessThan(100) // Verifica se a resposta é retornada em menos de 500ms
  })
})

describe('Teste da Rota excluirCliente', () => {
  let cliente: ClienteInstance
  beforeAll(async () => {
    // Cria um cliente com um ID único para o teste de exclusão
    cliente = await Cliente.create({
      nome: 'Teste',
      sobrenome: 'Cliente',
      cpf: '00000000000'
    })
    // Adicione lógica para garantir que não há pedidos vinculados, se necessário
  })

  it('Deve excluir um cliente existente', async () => {
    const response = await request(app).delete(`/excluirCliente/${cliente.id}`)

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Cliente excluído com sucesso'
    )

    // Verifica se o cliente foi realmente excluído
    const clienteExcluido = await Cliente.findByPk(cliente.id)
    expect(clienteExcluido).toBeNull() // Deve retornar null se o cliente foi excluído
  })

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await Cliente.destroy({ where: { id: cliente.id } })
  })
})

describe('Teste da Rota atualizarCliente', () => {
  let clienteId: number
  let clienteExistenteId: number

  beforeAll(async () => {
    // Cria um cliente para testes
    const cliente = await Cliente.create({
      nome: 'Cliente',
      sobrenome: 'Existente',
      cpf: '12345678900'
    })
    clienteExistenteId = cliente.id

    // Cria outro cliente para ser atualizado
    const clienteParaAtualizar = await Cliente.create({
      nome: 'Cliente',
      sobrenome: 'Para Atualizar',
      cpf: '09876543211'
    })
    clienteId = clienteParaAtualizar.id
  })

  it('Deve atualizar um cliente com sucesso', async () => {
    const clienteAtualizado = {
      nome: 'Cliente Atualizado',
      sobrenome: 'Sobrenome Atualizado',
      cpf: '09876543211'
    }

    const response = await request(app)
      .put(`/atualizarCliente/${clienteId}`)
      .send(clienteAtualizado)

    expect(response.status).toBe(200)
    expect(response.body.nome).toBe(clienteAtualizado.nome)
    expect(response.body.sobrenome).toBe(clienteAtualizado.sobrenome)
    expect(response.body.cpf).toBe(clienteAtualizado.cpf)
  })

  it('Deve retornar erro ao tentar atualizar cliente com CPF já existente', async () => {
    const clienteAtualizado = {
      nome: 'Novo Nome',
      sobrenome: 'Novo Sobrenome',
      cpf: '12345678900' // CPF já usado por clienteExistenteId
    }

    const response = await request(app)
      .put(`/atualizarCliente/${clienteId}`)
      .send(clienteAtualizado)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty(
      'message',
      'CPF já está sendo usado por outro cliente'
    )
  })

  it('Deve retornar erro ao tentar atualizar cliente inexistente', async () => {
    const clienteInexistenteId = 999999
    const clienteAtualizado = {
      nome: 'Nome',
      sobrenome: 'Sobrenome',
      cpf: '00000000000'
    }

    const response = await request(app)
      .put(`/atualizarCliente/${clienteInexistenteId}`)
      .send(clienteAtualizado)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Cliente não encontrado')
  })

  afterAll(async () => {
    await Cliente.destroy({ where: { id: clienteExistenteId } })
    await Cliente.destroy({ where: { id: clienteId } })
  })
})
