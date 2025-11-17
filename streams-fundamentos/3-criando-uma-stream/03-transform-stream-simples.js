import { Transform } from 'node:stream'

class UpperCaseTransformSimple extends Transform {
    // Transform Stream que converte para maiúsculas
    _transform(chunck, encoding, callback){
        // Transforma o chunk
        const transformed = chunck.toString().toUpperCase()
        
        // Envia o dado transformado
        this.push(transformed)
        callback()
    }
}

const upperCaseTransformSimple = new UpperCaseTransformSimple()

// Criando um pipeline
process.stdin
    .pipe(upperCaseTransformSimple)
    .pipe(process.stdout)

console.log('Digite algo (Ctrl+C para sair):');