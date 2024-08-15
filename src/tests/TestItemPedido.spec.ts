const request = require('supertest')
import * as server from '../server'
import { app } from '../server' // Certifique-se de que o caminho está correto
import { Request, Response } from 'express'
import { Produto, ProdutoInstance } from '../models/Produto'
import { Cliente, ClienteInstance } from '../models/Cliente'
import { Pedido, PedidoInstance } from '../models/Pedido'
import { ItemDoPedido } from '../models/ItemDoPedido'

describe('Teste da Rota incluirItemDoPedido', () => {
  let itemDoPedidoId: number
  let pedido: PedidoInstance
  let cliente: ClienteInstance
  let produto: ProdutoInstance

  it('Deve incluir um novo ItemDoPedido com sucesso', async () => {
    cliente = await Cliente.create({
      nome: 'Teste',
      sobrenome: 'Cliente',
      cpf: '22222222222'
    })

    produto = await Produto.create({
      descricao: 'Teste Produto'
    })

    pedido = await Pedido.create({
      data: Date.now(),
      id_cliente: cliente.id
    })

    const novoItemDePedido = {
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    }

    const response = await request(app)
      .post('/incluirItemDoPedido')
      .send(novoItemDePedido)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id_pedido).toBe(novoItemDePedido.id_pedido)
    expect(response.body.id_produto).toBe(novoItemDePedido.id_produto)
    expect(response.body.qtdade).toBe(novoItemDePedido.qtdade)

    itemDoPedidoId = response.body.id
    console.log('response.body: ' + JSON.stringify(response.body))
  })

  afterEach(async () => {
    // if (itemDoPedidoId) {
    await ItemDoPedido.destroy({ where: { id: itemDoPedidoId } })
    await Pedido.destroy({ where: { id: pedido.id } })
    await Cliente.destroy({ where: { id: cliente.id } })
    await Produto.destroy({ where: { id: produto.id } })
    // }
  })
})

describe('Teste da Rota getItensDoPedidoById', () => {
  let itemDoPedidoId: number
  let pedido: PedidoInstance
  let cliente: ClienteInstance
  let produto: ProdutoInstance
  it('Deve retornar o ItemDoPedido correto quando o id é válido', async () => {
    cliente = await Cliente.create({
      nome: 'OI',
      sobrenome: 'TV',
      cpf: '01234567891'
    })

    produto = await Produto.create({
      descricao: 'Teste Produto'
    })

    pedido = await Pedido.create({
      data: Date.now(),
      id_cliente: cliente.id
    })

    const itemDoPedido = await ItemDoPedido.create({
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    })

    itemDoPedidoId = itemDoPedido.id
    // console.log("itemDoPedido.id: " + itemDoPedido.id)
    const response = await request(app).get(`/itensDoPedido/${itemDoPedidoId}`)

    expect(response.status).toBe(200)
    expect(response.body.itemDoPedido).toHaveProperty('id', itemDoPedidoId)
  })

  it('Deve retornar um status 404 quando o Id do itensDoPedido não existe', async () => {
    const itensDoPedidoID = 999

    const response = await request(app).get(`/itensDoPedido/${itensDoPedidoID}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Item do Pedido não encontrado')
  })

  afterEach(async () => {
    if (itemDoPedidoId) {
      await ItemDoPedido.destroy({ where: { id: itemDoPedidoId } })
      await Pedido.destroy({ where: { id: pedido.id } })
      await Cliente.destroy({ where: { id: cliente.id } })
      await Produto.destroy({ where: { id: produto.id } })
    }
  })
})

describe('Teste da Rota listarItemDoPedido', () => {
  let itemDoPedidoId1: number
  let itemDoPedidoId2: number
  let pedido: PedidoInstance
  let cliente: ClienteInstance
  let produto: ProdutoInstance

  it('Deve retornar uma lista de ItemDoPedido', async () => {
    cliente = await Cliente.create({
      nome: 'OI',
      sobrenome: 'TV',
      cpf: '01234567891'
    })

    produto = await Produto.create({
      descricao: 'Teste Produto'
    })

    pedido = await Pedido.create({
      data: Date.now(),
      id_cliente: cliente.id
    })

    const itemDoPedido1 = await ItemDoPedido.create({
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    })

    itemDoPedidoId1 = itemDoPedido1.id

    const itemDoPedido2 = await ItemDoPedido.create({
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    })

    itemDoPedidoId2 = itemDoPedido2.id

    const response = await request(app).get('/itensDoPedido')

    expect(response.status).toBe(200)
    expect(response.body.itensDoPedido).toBeInstanceOf(Array)
  })

  it('Deve retornar a lista de ItemDoPedido dentro de um tempo aceitável', async () => {
    const start = Date.now()
    const response = await request(app).get('/itensDoPedido')
    const duration = Date.now() - start

    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(100) // Verifica se a resposta é retornada em menos de 100ms
  })

  afterEach(async () => {
    await ItemDoPedido.destroy({ where: { id: itemDoPedidoId1 } })
    await ItemDoPedido.destroy({ where: { id: itemDoPedidoId2 } })
    await Pedido.destroy({ where: { id: pedido.id } })
    await Cliente.destroy({ where: { id: cliente.id } })
    await Produto.destroy({ where: { id: produto.id } })
  })
})

describe('Teste da Rota excluirItemDoPedido', () => {
  let itemDoPedidoId: number
  let pedido: PedidoInstance
  let cliente: ClienteInstance
  let produto: ProdutoInstance

  beforeAll(async () => {
    cliente = await Cliente.create({
      nome: 'Claro',
      sobrenome: 'TV',
      cpf: '01234567891'
    })

    produto = await Produto.create({
      descricao: 'Teste Produto'
    })

    pedido = await Pedido.create({
      data: Date.now(),
      id_cliente: cliente.id
    })

    const itemDoPedido = await ItemDoPedido.create({
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    })
    console.log('itemDoPedido: ' + itemDoPedido.id)
    itemDoPedidoId = itemDoPedido.id
  })

  afterEach(async () => {
    await ItemDoPedido.destroy({ where: { id: itemDoPedidoId } })
    await Pedido.destroy({ where: { id: pedido.id } })
    await Cliente.destroy({ where: { id: cliente.id } })
    await Produto.destroy({ where: { id: produto.id } })
  })

  it('Deve excluir um ItemDoPedido existente', async () => {
    const response = await request(app).delete(
      `/excluirItemDoPedido/${itemDoPedidoId}`
    )

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Item do Pedido excluído com sucesso'
    )

    const produtoExcluido = await Produto.findByPk(itemDoPedidoId)
    expect(produtoExcluido).toBeNull()
  })
})

describe('Teste da Rota atualizarItemDoPedido', () => {
  let itemDoPedidoId: number
  let pedido: PedidoInstance
  let cliente: ClienteInstance
  let produto: ProdutoInstance

  beforeAll(async () => {
    cliente = await Cliente.create({
      nome: 'SKY',
      sobrenome: 'TV',
      cpf: '01234567891'
    })

    produto = await Produto.create({
      descricao: 'Teste Produto'
    })

    pedido = await Pedido.create({
      data: Date.now(),
      id_cliente: cliente.id
    })

    const itemDoPedido = await ItemDoPedido.create({
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 1
    })
    itemDoPedidoId = itemDoPedido.id
  })

  it('Deve atualizar um ItemDoPedido com sucesso', async () => {
    const itemDoPedido = {
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 3
    }

    const response = await request(app)
      .put(`/atualizarItemDoPedido/${itemDoPedidoId}`)
      .send(itemDoPedido)

    expect(response.status).toBe(200)
    expect(response.body.id_pedido).toBe(itemDoPedido.id_pedido);
    expect(response.body.id_produto).toBe(itemDoPedido.id_produto);
    expect(response.body.qtdade).toBe(itemDoPedido.qtdade);
  })

  it('Deve retornar erro ao tentar atualizar ItemDoPedido inexistente', async () => {
    const itemDoPedidoInexistenteId = 999999
    const itemDoPedidoAtualizado = {
      id_pedido: pedido.id,
      id_produto: produto.id,
      qtdade: 3
    }

    const response = await request(app)
      .put(`/atualizarItemDoPedido/${itemDoPedidoInexistenteId}`)
      .send(itemDoPedidoAtualizado)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty(
      'message',
      'Item do Pedido não encontrado'
    )
  })

  afterEach(async () => {
    await ItemDoPedido.destroy({ where: { id: itemDoPedidoId } })
    await Pedido.destroy({ where: { id: pedido.id } })
    await Cliente.destroy({ where: { id: cliente.id } })
    await Produto.destroy({ where: { id: produto.id } })
  })
})
