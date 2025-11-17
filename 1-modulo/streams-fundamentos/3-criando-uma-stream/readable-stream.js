import { Readable } from 'node:stream'


class OnToHundreStream extends Readable {
    index = 1

    _read() {
        setTimeout(() => {
            const i = this.index++

            if (i > 100) {
                this.push(null)
            } else {
                const buffer = Buffer.from(String(i))
                this.push(buffer)
            }
        }, 1000)
    }
}


new OnToHundreStream().pipe(process.stdout)