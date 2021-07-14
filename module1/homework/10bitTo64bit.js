// 保留8位小数
// 64位浮点数可用数字0-9,A-Z,a-z,-,~表示
function TenBitTo64Bit(num) {
    const integer = Math.floor(num)
    const fraction = num - integer

    const integerInNew = []
    const fractionInNew = []
    const numSelection = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-~'

    let integerLeftNow = integer

    while(integerLeftNow > 0) {
        integerInNew.push(numSelection[integerLeftNow % 64])
        integerLeftNow = Math.floor(integerLeftNow / 64)
    }

    let fractionNow = fraction

    for(let i = 0; i < 8; i++) {
        fractionNow = fractionNow * 64
        fractionInNew.push(numSelection[Math.floor(fractionNow)])
        fractionNow -= Math.floor(fractionNow)
    }
    return `${integerInNew.reverse().join('')}.${fractionInNew.join('')}`
}

console.log(TenBitTo64Bit(10.1243345))