import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export class HashManager {
  //gerar o hash
  public hash = async (plaintext: string) => {
    //qual o nivel/custo de segunrança
    const rounds = Number(process.env.BCRYPT_COST)
    //quantidade de hash possiveis para a senha
    const salt = await bcrypt.genSalt(rounds)
    //senha digitada, nivel de segurança
    const hash = await bcrypt.hash(plaintext, salt)

    return hash
  }

  //verificar se a senha esta correta
  public compare = async (plaintext: string, hash: string) => {
      // aqui não precisa do await porque o return já se comporta como um
      return bcrypt.compare(plaintext, hash)
  }
}