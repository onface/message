var message = require('face-message')
// 默认延迟3秒关闭
message.info('信息')
message.success('成功')
message.error('错误')
message.warn('警告')
message.loading('加载')

message.info('延迟2秒', 2)

var info = message.info('手动关闭', false)
setTimeout(function() {
    info.hide()
}, parseFloat(Math.random()*1000))

var dom = document.createElement('em')
setTimeout(function callee () {
    dom.innerHTML = 'dom' + Math.random()
    setTimeout(callee, 500)
}, 500)
message.info(dom)


document.getElementById('show').onclick = function () {
    message.loadingBar.show(2)
}

document.getElementById('hide').onclick = function () {
    message.loadingBar.hide()
}
document.getElementById('fail').onclick = function () {
    message.loadingBar.fail()
}
