var extend = require('safe-extend')
const Motion = require('motion-logic')
const bar = {
    el: {
        bar: null
    },
    _config: {
        prefixClassName: 'face-message'
    },
    config: function (settings) {
        this._config = extend(true, this._config, settings)
    },
    defaultTitle: '',
    hideTimer: null,
    onAction: function (bar, mountData) {
        bar.el.bar.style.width = parseFloat(bar.el.bar.style.width || 0) +  mountData + '%'
    },
    show: function (sec) {
        const self = this
        if (!self.el.bar) {
            let barNode = document.createElement('div')
            barNode.setAttribute('class',  self._config.prefixClassName + '-loading-bar')
            self.el.bar = barNode
            document.body.appendChild(barNode)
        }
        self.el.bar.style.display = 'block'
        self.el.bar.style.width = '0%'
        self.motion = new Motion({
            value: 95,
            effect: 'easeOutCirc',
            duration: sec*1000,
            onAction: function (mountData) { self.onAction(self, mountData) }
        })
        self.motion.run()
    },
    hide: function () {
        const self = this
        let prefixClassName = self._config.prefixClassName
        if (!self.el.bar){self.show(1)}
        self.el.bar.style.display = 'block'
        self.motion.stop()
        self.motion = new Motion({
            value: 100 - parseFloat(self.el.bar.style.width || 0),
            effect: 'easeOutCirc',
            duration: .5*1000,
            onAction: function (mountData) { self.onAction(self, mountData) },
            onStop: function () {
                clearTimeout(self.hideTimer)
            },
            onDone: function () {
                self.el.bar.setAttribute(
                    'class',
                    self.el.bar.getAttribute('class') + ` ${prefixClassName}-loading-bar--fadeout`
                )
                self.el.bar.setAttribute(
                    'class',
                    self.el.bar.getAttribute('class') + ` ${prefixClassName}-loading-bar--done`
                )
                self.hideTimer = setTimeout(function () {
                    self.el.bar.style.display = 'none'
                    self.el.bar.setAttribute(
                        'class',
                        self.el.bar.getAttribute('class')

                            .replace(new RegExp(`${prefixClassName}-loading-bar--fadeout`, 'g'), '')
                            .replace(new RegExp(`${prefixClassName}-loading-bar--fail`, 'g'), '')
                            .replace(new RegExp(`${prefixClassName}-loading-bar--done`, 'g'), '')
                            .replace(/\s+/g, '')
                    )
                }, 500)

            }
        })
        self.motion.run()
    },
    fail: function () {
        const self = this
        let prefixClassName = self._config.prefixClassName
        if (!self.el.bar){self.show(1)}
        self.el.bar.style.display = 'block'
        self.el.bar.setAttribute(
            'class',
            self.el.bar.getAttribute('class') + ` ${prefixClassName}-loading-bar--fail`
        )
        self.hide()
    }
}
module.exports = bar
