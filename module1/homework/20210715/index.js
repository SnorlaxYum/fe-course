function linkedList(val, next) {
    this.val = val
    this.next = next
}

function reverseTwoLink(cur, prev) {
    if(!cur) {
        return prev
    }
    const {next} = cur
    cur.next = prev
    return reverseTwoLink(next, cur)
}

function reverseLinkedList(oriList) {
    return reverseTwoLink(oriList, null)
}

function printLinked(list) {
    const final = []
    let cur = list
    while(cur) {
        final.push(cur.val)
        cur = cur.next
    }
    return final
}

function main(n) {
    const testArray = Array(n).fill(1).map((_, index) => {
        return new linkedList(index, null)
    })

    for(let i = 1; i < testArray.length; i++) {
        testArray[i-1].next = testArray[i]
    }
    console.log(`Original: ${printLinked(testArray[0]).join(',')}`)
    console.log(`Reversed: ${printLinked(reverseLinkedList(testArray[0])).join(',')}`)
}

main(100)