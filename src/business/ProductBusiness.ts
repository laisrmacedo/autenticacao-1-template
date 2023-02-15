import { ProductDatabase } from "../database/ProductDatabase"
import { CreateProductInput, CreateProductOutput, GetProductsInput, GetProductsOutput } from "../dtos/productDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Product } from "../models/Product"
import { IdGenerator } from "../services/IdGenerator"

export class ProductBusiness {
    constructor(
        private productDatabase: ProductDatabase,
        private idGenerator: IdGenerator,

    ) {}

    public getProducts = async (
        input: GetProductsInput
    ): Promise<GetProductsOutput> => {
        const { q } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        const productsDB = await this.productDatabase.findProducts(q)

        const products = productsDB.map((productDB) => {
            const product = new Product(
                productDB.id,
                productDB.name,
                productDB.price,
                productDB.created_at
            )

            return product.toBusinessModel()
        })

        const output: GetProductsOutput = products

        return output
    }

    public createProduct = async (
        input: CreateProductInput
    ): Promise<CreateProductOutput> => {
        const { name, price } = input

        // if (typeof id !== "string") {
        //     throw new BadRequestError("'id' deve ser string")
        // }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof price !== "number") {
            throw new BadRequestError("'price' deve ser number")
        }

        if (name.length < 2) {
            throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
        }

        if (price <= 0) {
            throw new BadRequestError("'price' não pode ser zero ou negativo")
        }

        // const productDBExists = await this.productDatabase.findProductById(id)

        // if (productDBExists) {
        //     throw new BadRequestError("'id' já existe")
        // }

        const id = this.idGenerator.generate()

        const newProduct = new Product(
            id,
            name,
            price,
            new Date().toISOString()
        )

        const newProductDB = newProduct.toDBModel()
        await this.productDatabase.insertProduct(newProductDB)

        const output: CreateProductOutput = {
            message: "Producto cadastrado com sucesso",
            product: newProduct.toBusinessModel()
        }

        return output
    }
}