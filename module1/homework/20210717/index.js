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
        currentParents.push(parentNode)
        currentLoc = {parentNode, children: [], tag: '', attributes: {}, innerText: ''}
        parentNode.children.push(currentLoc)
    }
    function start(c) {
        if(/[\s]/.exec(c)) {
            return start
        }
        if(c === '<') {
            return startTag('<')
        }
    }
    function startTag(c) {
        if(c === '<') {
            newChildCurrentLoc()
            return startTag
        }
        if(/[a-z]/.exec(c)) {
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
            return startTagAttributeName
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
            return startTagAttributeValue
        }
    }
    function startTagAttributeValue(c) {
        if(c === '"') {
            return startTagEnd
        }
        currentLoc.attributes[currentAttribute] += c
        return startTagAttributeValue
    }
    function startTagEnd(c) {
        if(/[\s]/.exec(c)) {
            return startTagEnd
        }
        if(c === '>') {
            return afterStartTag
        }
    }

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
            return afterStartTag
        }
        currentLoc.innerText += c
        return currentTagInnerText
    }

    function openStartAfterStartTag(c) {
        if(/[\s]/.exec(c)) {
            return openStartAfterStartTag
        }
        if(c === '/') {
            currentLocToParent()
            return endTagStart
        }
        if(/[a-z]/.exec(c)) {
            newChildCurrentLoc()
            return startTag(c)
        }
    }


    function endTagStart(c) {
        if(c === '/') {
            currentLocToParent()
            return endTagName
        }
        if(/[a-z]/.exec(c)) {
            return endTagName(c)
        }
    }
    function endTagName(c) {
        if(/[a-z]/.exec(c)) {
            currentEndTag += c
            return endTagName
        }
        if(/[\s]/.exec(c)) {
            if(currentEndTag !== currentLoc.tag) {
                throw new Error(`${currentLoc.tag} not mataching with ${currentEndTag}`)
            }
        }
    }
    function endTagEnd(c) {
        if(c === '/') {
            currentLocToParent()
            return endTagEnd
        }
        if(/[\s]/.exec(c)) {
            return endTagEnd
        }
        if(c === '>') {
            return start
        }
    }

    let status

    for(let i = 0; i < template.length; i++) {
        status = start(template[i])
    }
}
 
render(tmpl, {
	image: "some img", 
    info: {showImage: true, showDate:false, name: "aaa"}
})