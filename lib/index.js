var extend = require('safe-extend')
require('face-icon/lib/index.css')
require('./index.css')
function setProps () {
    message.el.wrapNode.setAttribute('class', message._config.prefixClassName + '-wrap')
}
var message = {
    el: {},
    _config: {
        duration: 3,
        prefixClassName: 'face-message',
        iconMap: {
            'info': 'info-of',
            'success': 'check-of',
            'error': 'close-of',
            'warn': 'warning-of',
            'loading': 'loading'
        }
    },
    init: function () {
        var message = this
        message.el.wrapNode = document.createElement('div')
        setProps()
        document.body.appendChild(message.el.wrapNode)
    },
    config: function (settings) {
        this._config = extend(true, this._config, settings)
        setProps()
    },
    show: function (type, content, duration) {
        var message = this
        duration = typeof duration === 'undefined'? message._config.duration: duration
        if (duration === false) {
            // 60*24*30
            duration = 43200
        }
        if (typeof message.el.wrapNode === 'undefined') {
            message.init()
        }
        var itemNode = document.createElement('div')
        let prefixClassName = message._config.prefixClassName
        itemNode.setAttribute('class', `${prefixClassName}-item`)
        itemNode.innerHTML = `
        <div class="${prefixClassName} ${prefixClassName}--themes-${type}">
            <span class="${prefixClassName}-icon">
                <div class="fi fi-${message._config.iconMap[type] || type}"></div>
            </span>
            <div class="${prefixClassName}-content">
            </div>
        </div>
        `
        let messageNode = itemNode.getElementsByClassName(prefixClassName)[0]
        let contentNode = itemNode.getElementsByClassName(`${prefixClassName}-content`)[0]
        if (typeof content === 'string') {
            contentNode.innerHTML = content
        }
        else {
            contentNode.appendChild(content)
        }
        message.el.wrapNode.appendChild(itemNode)
        setTimeout(function () {
            messageNode.setAttribute(
                'class',
                messageNode.getAttribute('class') + ` ${prefixClassName}--fadein`
            )
        }, 10)
        let command = {
            el: {
                root: itemNode,
                message: messageNode,
                content: contentNode
            }
        }
        command.hide = function () {
            messageNode.setAttribute(
                'class',
                messageNode.getAttribute('class') + ` ${prefixClassName}--fadeout`
            )
            setTimeout(function () {
                message.el.wrapNode.removeChild(itemNode)
            }, 500)
            command.hide = function(){}
        }
        setTimeout(function () {
            command.hide()
        }, duration * 1000)
        return command
    },
    info: function (content, duration) {
        return this.show('info', content, duration)
    },
    success: function (content, duration) {
        return this.show('success', content, duration)
    },
    error: function (content, duration) {
        return this.show('error', content, duration)
    },
    warn: function (content, duration) {
        return this.show('warn', content, duration)
    },
    loading: function (content, duration) {
        return this.show('loading', content, duration)
    }
}
message.loadingBar = require('./bar')
module.exports = message
