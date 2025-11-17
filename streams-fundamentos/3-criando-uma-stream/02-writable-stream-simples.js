import { Writable } from 'node:stream'

// Criando uma Writable Stream
class WritableStreamSimple extends Writable{
    _write(chunck, encoding, callback){
        // Este método é chamado para cada chunk escrito
        console.log('Escrevendo: ', chunck.toString())
        callback();
    }
}


const writableStreamSimple = new WritableStreamSimple()



// Escrevendo dados
writableStreamSimple.write("Primeira Linha\n")
writableStreamSimple.write("Segunda Linha\n")
writableStreamSimple.write("Terceira Linha\n")


// finalizando a stream
writableStreamSimple.end("útilma linha\n")


// Evento quando a escrita termina
writableStreamSimple.on('finish', () => {
    console.log('✅ Escrita finalizada!');
})