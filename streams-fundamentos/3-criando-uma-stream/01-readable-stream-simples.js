import { Readable } from 'node:stream'




// Criando uma Readable Stream simples
class ReadableStreamSimple extends Readable {
    // Este método é chamado quando alguém quer ler dados
    _read() {
        this.push('olá ')
        this.push('Mundo ')
        this.push('das ')
        this.push('Streams!\n')

        this.push(null) // inidica que não há mais dados
    }
}



//  consumindo as streams
const readableStreamSimple = new ReadableStreamSimple()
readableStreamSimple.on('data', (chunck) => {
        console.log('recebido', chunck.toString())

})

readableStreamSimple.on('end', () => {
    console.log('✅ Leitura finalizada!')
})