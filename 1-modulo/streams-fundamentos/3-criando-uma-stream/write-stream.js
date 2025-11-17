import { Writable, Readable } from 'node:stream'


// stream de leirtura
class OnToHundreStream extends Readable {
    index = 1

    _read() {
        const i = this.index++

        setTimeout(() => {
            if( i > 50){
                this.push(null)
            } else {
                const buffer = Buffer.from(String(i))
                this.push(buffer)
            }
        }, 1000)

    }
}

// class de stream de leitura
class MutiplyByTenStream extends Writable {
    // precisa de 3 parametros OBRIGATORIOS
    _write(chunk, encoding, callback){
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}

new OnToHundreStream()
    .pipe(new MutiplyByTenStream())