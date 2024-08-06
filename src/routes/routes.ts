import { Router } from "express";

import * as ApiController from "../controllers/apiController";
import * as ClienteController from "../controllers/ClienteController";
import * as ItemDoPedidoController from "../controllers/ItemDoPedidoController";
import * as PedidoController from "../controllers/PedidoController";
import * as ProdutoController from "../controllers/ProdutoController";

const router = Router();

//CLIENTES
router.get("/clientes", ClienteController.listarClientes); //Testada
router.get("/clientes/:idCliente", ClienteController.getClienteById); //Testada
router.delete("/excluirCliente/:idCliente", ClienteController.excluirCliente); //Testada
router.post("/incluirCliente", ClienteController.incluirCliente); //Testada
router.put("/atualizarCliente/:idCliente", ClienteController.atualizarCliente); //Testada

//PRODUTOS
router.get("/produtos", ProdutoController.listarProdutos); //Testada
router.get("/produtos/:idProduto", ProdutoController.getProdutoById); //Testada
router.post("/incluirProduto", ProdutoController.incluirProduto); //Testada
router.put("/atualizarProduto/:id", ProdutoController.atualizarProduto); //Testada
router.delete("/excluirProduto/:id", ProdutoController.excluirProduto); //Testada

//PEDIDOS
router.get("/Pedidos", PedidoController.listarPedidos);
router.get("/pedidos/:idPedido", PedidoController.getPedidoById);
router.post("/incluirPedido", PedidoController.incluirPedido);
router.put("/atualizarPedido/:id", PedidoController.atualizarPedido);
router.delete("/excluirPedido/:id", PedidoController.excluirPedido);

// ITENS DO PEDIDO
router.get("/itensDoPedido", ItemDoPedidoController.listarItensDoPedido);
router.get("/itensDoPedido/:id", ItemDoPedidoController.getItemDoPedidoById);
router.post("/incluirItemDoPedido", ItemDoPedidoController.incluirItemDoPedido);
router.put("/atualizarItemDoPedido/:id", ItemDoPedidoController.atualizarItemDoPedido);
router.delete("/excluirItemDoPedido/:id", ItemDoPedidoController.excluirItemDoPedido);

export default router;
