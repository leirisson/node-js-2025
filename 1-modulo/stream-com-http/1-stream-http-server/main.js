import http from 'node:http'
import { Transform } from 'node:stream'



class MutiplyByTenStream extends Transform {
    // precisa de 3 parametros OBRIGATORIOS
    _transform(chunk, encoding, callback) {
        const transformado = Number(chunk.toString()) * 10

        console.log(transformado)
        
        callback(null, Buffer.from(String(transformado)))
    }
}

const server = http.createServer((req, res) => {
    return req
        .pipe(new MutiplyByTenStream())
        .pipe(res)
})

server.listen(3334,  () => {
  console.log('🚀 Servidor em http://localhost:3334');
})