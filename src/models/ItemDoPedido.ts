import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";
import { Pedido, PedidoInstance } from "./Pedido";
import { Produto, ProdutoInstance } from "./Produto";

export interface ItemDoPedidoInstance extends Model {
  id: number;
  id_produto: number;
  id_pedido: number;
  qtdade: number;
  Produto?: ProdutoInstance; // Adiciona o tipo Produto opcional
  Pedido?: PedidoInstance; // Adiciona o tipo Pedido opcional
}

export const ItemDoPedido = sequelize.define<ItemDoPedidoInstance>(
  "ItemDoPedido",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      references: {
        model: Pedido,
        key: "id"
      }
    },
    id_produto: {
      type: DataTypes.INTEGER,
      references: {
        model: Produto,
        key: "id"
      }
    },
    qtdade: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: "item_do_pedido",
    timestamps: false
  }
);

// Defina as associações com aliases
// ItemDoPedido.belongsTo(Produto, { as: "Produto", foreignKey: "id_produto" });
// ItemDoPedido.belongsTo(Pedido, { as: "Pedido", foreignKey: "id_pedido" });
