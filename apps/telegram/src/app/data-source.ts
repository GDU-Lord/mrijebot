import { DataSource } from "typeorm"

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 3456,
  username: 'postgres',
  password: 'postgres',
  database: 'mrijebot',
})

export async function initDataSource() {
  await dataSource.initialize()
  .then(() => {
      console.log("Data Source has been initialized!")
  })
  .catch((err) => {
      console.error("Error during Data Source initialization", err)
  })
}
