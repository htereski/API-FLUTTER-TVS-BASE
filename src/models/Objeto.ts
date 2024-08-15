import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";

export interface ObjetoInstance extends Model {
  id: number;
  nome: string;
}

export const Objeto = sequelize.define<ObjetoInstance>(
  "Cliente",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nome: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: "objetos",
    timestamps: false
  }
);
