let tmpl = `<div class="newslist">
    <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
    <div class="date" v-if="info.showDate">{{info.name}}</div>
    <div class="img">{{info.name}}</div>
</div>`;

// no comment version

function render(template, data) {
    let currentEndTag = ''
    const tree = {tag: 'root', children: []}
    let currentParents = []
    let currentLoc = tree
    let currentAttribute = ''
    function currentLocToParent() {
        currentLoc = currentParents.pop()
    }
    function newChildCurrentLoc() {
        const parentNode = currentLoc
        if(currentParents[currentParents.length-1] !== parentNode) {
            currentParents.push(parentNode)
        }
        currentLoc = {parentNode, children: [], tag: '', attributes: {}}
        parentNode.children.push(currentLoc)
    }
    function newTextChildCurrentLoc() {
        const parentNode = currentLoc
        if(currentParents[currentParents.length-1] !== parentNode) {
            currentParents.push(parentNode)
        }
        currentLoc = {parentNode, type: 'text', innerText: ''}
        parentNode.children.push(currentLoc)
    }
    function start(c) {
        if(/[\s]/.exec(c)) {
            return start
        }
        if(c === '<') {
            return startTag(c)
        }
    }
    function startTag(c) {
        if(c === '<') {
            newChildCurrentLoc()
            return startTag
        }
        if(/[A-Za-z]/.exec(c)) {
            currentLoc.tag += c
            return startTag
        }
        if(/[\s]/.exec(c)) {
            if(currentLoc.tag.length) {
                return startTagAttributeName
            }
            return startTag
        }
        if(c === '/') {
            return endTagEnd(c)
        }
        if(c === '>') {
            return afterStartTag
        }
    }
    function startTagAttributeName(c) {
        if(/[\s]/.exec(c)) {
            if(currentAttribute.length) {
                currentLoc.attributes[currentAttribute] = ''
                return startTagAttributeBeforeEqualSign
            }
            return startTagAttributeName
        }
        if(/[a-z-]/.exec(c)) {
            currentAttribute += c
            console.log(currentAttribute)
            return startTagAttributeName
        }
        if(c === '=') {
            return startTagAttributeBeforeQuote
        }
        if(c === '>') {
            return afterStartTag
        }
        if(c === '/') {
            return endTagEnd
        }
    }
    function startTagAttributeBeforeEqualSign(c) {
        if(/[\s]/.exec(c)) {
            return startTagAttributeBeforeEqualSign
        }
        if(c === '=') {
            return startTagAttributeBeforeQuote
        }
    }
    function startTagAttributeBeforeQuote(c) {
        if(/[\s]/.exec(c)) {
            return startTagAttributeBeforeQuote
        }
        if(c === '"') {
            currentLoc.attributes[currentAttribute] = ""
            return startTagAttributeValue
        }
    }
    function startTagAttributeValue(c) {
        if(c === '"') {
            currentAttribute = ""
            return startTagAttributeName
        }
        currentLoc.attributes[currentAttribute] += c
        return startTagAttributeValue
    }
    // function startTagEnd(c) {
    //     if(/[\s]/.exec(c)) {
    //         return startTagEnd
    //     }
    //     if(c === '>') {
    //         return afterStartTag
    //     }
    // }

    function afterStartTag(c) {
        if(/[\s]/.exec(c)) {
            return afterStartTag
        }
        if(c === '<') {
            return openStartAfterStartTag
        }
        return currentTagInnerText(c)
    }

    function currentTagInnerText(c) {
        if(c === '<') {
            currentLocToParent()
            return openStartAfterEndTag
        }
        if(currentLoc.tag) {
            newTextChildCurrentLoc()
        }
        currentLoc.innerText += c
        return currentTagInnerText
    }

    function openStartAfterStartTag(c) {
        if(/[\s]/.exec(c)) {
            return openStartAfterStartTag
        }
        if(c === '/') {
            return endTagStart(c)
        }
        if(/[A-Za-z]/.exec(c)) {
            newChildCurrentLoc()
            return startTag(c)
        }
    }


    function endTagStart(c) {
        if(c === '/') {
            return endTagStart
        }
        if(/[A-Za-z]/.exec(c)) {
            return endTagName(c)
        }
    }
    function endTagName(c) {
        if(/[A-Za-z]/.exec(c)) {
            currentEndTag += c
            return endTagName
        }
        if(/[\s]/.exec(c)) {
            if(currentEndTag !== currentLoc.tag) {
                throw new Error(`${currentLoc.tag} not mataching with ${currentEndTag}`)
            }
            currentEndTag = ''
            return endTagName
        }
        if(c === '>') {
            if(currentEndTag !== currentLoc.tag) {
                throw new Error(`${currentLoc.tag} not mataching with ${currentEndTag}`)
            }
            currentEndTag = ''
            return endTagEnd(c)
        }
    }
    function endTagEnd(c) {
        if(/[\s]/.exec(c)) {
            return endTagEnd
        }
        if(c === '>') {
            currentLocToParent()
            console.log(currentLoc)
            return afterEndTag
        }
    }
    function afterEndTag(c) {
        if(/[\s]/.exec(c)) {
            return afterEndTag
        }
        if(c === '<') {
            return openStartAfterEndTag
        }
        newTextChildCurrentLoc()
        return textNodeNew(c)
    }

    function textNodeNew(c) {
        if(c === '<') {
            return start(c)
        }
        currentLoc.innerText += c
        return textNodeNew
    }

    function openStartAfterEndTag(c) {
        if(c === '/') {
            return endTagStart(c)
        }
        if(/[A-Za-z]/.exec(c)) {
            newChildCurrentLoc()
            return startTag(c)
        }
    }

    let status = start

    for(let i = 0; i < template.length; i++) {
        status = status(template[i])
    }

    function tempVarToValue(tempVar) {
        const existDecider = tempVar.split('.')
        if(existDecider.length === 1) {
            return data[existDecider[0]]
        }
        if(existDecider.length > 1) {
            let currentLevel = data
            for(const level of existDecider) {
                if(!currentLevel) {
                    return null
                }
                currentLevel = currentLevel[level]
            }
            return currentLevel
        }
        return null
    }

    function finalValue(originValue) {
        if(/{{([ ]+|[ ])?([A-Za-z.]+)([ ]+|[ ])?}}/.exec(originValue)) {
            const tempVar = /{{([ ]+|[ ])?([A-Za-z.]+)([ ]+|[ ])?}}/.exec(originValue)[2]
            return tempVarToValue(tempVar)
        }
        return originValue
    }

    function objToElement(obj) {
        // bypass root
        if(obj.tag === 'root') {
            return obj.children.map(objToElement).filter(isTruthy => isTruthy)
        }
        if(obj.attributes && obj.attributes['v-if']) {
            if(!tempVarToValue(obj.attributes['v-if'])) {
                return null
            }
        }
        if(obj.type === 'text') {
            const text = document.createTextNode(finalValue(obj.innerText))
            return text
        }
        const mainEle = document.createElement(obj.tag)
        for(const attr in obj.attributes) {
            mainEle.setAttribute(attr, finalValue(obj.attributes[attr]))
        }
        if(obj.children) {
            for(const child of obj.children) {
                console.log(child)
                const childEle = objToElement(child)
                if(childEle) {
                    mainEle.appendChild(childEle)
                }
            }
        }
        
        return mainEle
    }

    for(const ele of objToElement(tree)) {
        document.getElementById('app').appendChild(ele)
    } 
}
 
render(tmpl, {
	image: "b68bccd8c7f7aaa857eddef5bb33959b_b.png", 
    info: {showImage: true, showDate:false, name: "哈哈哈，渲染成功了！"}
})