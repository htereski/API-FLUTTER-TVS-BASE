import { Cliente } from "./Cliente";
import { Pedido } from "./Pedido";
import { Produto } from "./Produto";
import { ItemDoPedido } from "./ItemDoPedido";

// Definindo as associações entre os modelos

// Associação Cliente e Pedido
// Um Cliente pode ter muitos Pedidos. A tabela Pedido contém uma chave estrangeira id_cliente que referencia o Cliente.
Cliente.hasMany(Pedido, { foreignKey: "id_cliente", as: "Pedidos" });
// Um Pedido pertence a um único Cliente. A tabela Pedido contém uma chave estrangeira id_cliente que referencia o Cliente.
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente", as: "Cliente" });

// Associação Pedido e ItemDoPedido
// Um Pedido pode ter muitos ItensDoPedido. A tabela ItemDoPedido contém uma chave estrangeira id_pedido que referencia o Pedido.
Pedido.hasMany(ItemDoPedido, { foreignKey: "id_pedido", as: "ItensDoPedido" });
// Um ItemDoPedido pertence a um único Pedido. A tabela ItemDoPedido contém uma chave estrangeira id_pedido que referencia o Pedido.
ItemDoPedido.belongsTo(Pedido, { foreignKey: "id_pedido", as: "Pedido" });

// Associação Produto e ItemDoPedido
// Um Produto pode estar associado a muitos ItensDoPedido. A tabela ItemDoPedido contém uma chave estrangeira id_produto que referencia o Produto.
Produto.hasMany(ItemDoPedido, { foreignKey: "id_produto", as: "ItensDoPedido" });
// Um ItemDoPedido pertence a um único Produto. A tabela ItemDoPedido contém uma chave estrangeira id_produto que referencia o Produto.
ItemDoPedido.belongsTo(Produto, { foreignKey: "id_produto", as: "Produto" });
