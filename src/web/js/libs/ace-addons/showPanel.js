

var hasInitMdEditor = false;
var initMdEditor = function () {
    if(hasInitMdEditor) {
        return;
    }
    /*
    自己写的一个可以鼠标滑到dom能有相关提示的控件
    基于jquery
    I write a js file can show some hint message when mouse enter a dom
    base on jquery
    * */
    $.fn.DownPanel = function (opts) {
        opts = $.extend({
            render: '没有内容',
            width: 130,
            left: 0,
            top: 0,
            background: '#ffffff'
        }, opts || {});
    }

    var imgUrl = '';//上传图片返回的url

    var acen_edit = ace.edit('mdeditor');//左侧编辑框
    acen_edit.setTheme('ace/theme/chrome');
    acen_edit.getSession().setMode('ace/mode/markdown');
    acen_edit.renderer.setShowPrintMargin(false);
    $("#mdeditor").keyup(function () {//给左侧编辑框添加事件，，当键盘抬起时，右侧实时显示左侧的md内容
        $("#preview").html(marked(acen_edit.getValue()));
    });

    //DownPanel是我自己写的一个提示，当鼠标移到该dom上，回显示相关提示
    $('#bold').DownPanel({
        render: '<span style="color:#ffffff;">加粗</span>',
        background: '#000000',
        top: ($('#bold').offset().top + 40),
        left: ($('#bold').offset().left)
    });
    $('#code').DownPanel({
        render: '<span style="color:#ffffff;">插入代码</span>',
        background: '#000000',
        top: ($('#code').offset().top + 40),
        left: ($('#code').offset().left)
    });
    $('#hyperlink').DownPanel({
        render: '<span style="color:#ffffff;">插入超链接</span>',
        background: '#000000',
        top: ($('#hyperlink').offset().top + 40),
        left: ($('#hyperlink').offset().left)
    });
    $('#image').DownPanel({
        render: '<span style="color:#ffffff;">插入图片</span>',
        background: '#000000',
        top: ($('#image').offset().top + 40),
        left: ($('#image').offset().left)
    });
    $('#italic').DownPanel({
        render: '<span style="color:#ffffff;">斜体</span>',
        background: '#000000',
        top: ($('#italic').offset().top + 40),
        left: ($('#italic').offset().left)
    });

    //左侧插入，用户插入一些特定方法
    function insertText(val) {
        acen_edit.insert(val); //光标位置插入
    }

    //选择图片后，用于显示图片路径
    function setFile() {
        $('#fileName').val($('#file').val());
    }

    //上传图片到服务器，返回图片地址
    function uploadFile() {
        imgUrl = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white.png';
        $('#showImg').attr('src', 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white.png');
    }

    //插入图片弹窗取消
    function f_cancel() {
        $('#dialog').hide();
    }

    //插入图片
    function insert() {
        $('#dialog').hide();
        insertText('![这里写图片描述](' + imgUrl + ')')
    }

    //显示弹窗
    function showDialog() {
        $('#dialog').show();
    }

    var toggleEditor = false;
    // 切换宽度
    function toggleEditorWidth() {
        var $container = $('#container');
        if (!toggleEditor) {
            $container.find('.pull-left').css('width', '100%');
            $container.find('.pull-right').hide();
            toggleEditor = true;
        } else {
            $container.find('.pull-left').css('width', '50%');
            $container.find('.pull-right').show();
            toggleEditor = false;
        }
    }

    function saveReadme(content = '', callback) {
        var appName = Utils.getComponentName(Utils.getUrlParams('c') || '') || Utils.getComponentName(Utils.getUrlParams('webapp') || '');
        var value = ace.edit('mdeditor').getValue();

        if (!value) {
            Dialog.toast.warn({
                content: '文档内容不能为空'
            });
            return;
        }

        // 如果对应的变量数据没有在readme中
        if (content) {
            let insertString =`\`\`\`javascript
${content}
import`;

            value = value.replace(/```javascript((\t|\n|\s|.)+?)import/, insertString);
        }

        // 获取调试服务器组件目录下的readme
        axios.post(`/saveReadme`, {
            readmeContent: value,
            appName: appName
        }).then(res => {
            console.log(res.data.result);
            Dialog.toast.info(res.data.result);
            setTimeout(() => {
                callback && callback();
            }, 10000);
        }).catch(err => {
            Dialog.alert({
                content: '获取readme文档失败'
            });
            console.log(err);
        });
    }

    // 绑定保存readme文档
    function keyDown(e) {
        var showReadme = window.showReadme;
        if (!showReadme) {
            return;
        }
        var currKey = 0, e = e || event || window.event;
        currKey = e.keyCode || e.which || e.charCode;
        if (currKey == 83 && (e.ctrlKey || e.metaKey)) {
            saveReadme();
            return false;
        }
    }
    window.MdEditor = {
        insertText,
        setFile,
        uploadFile,
        f_cancel,
        showDialog,
        insert,
        saveReadme,
        toggleEditorWidth,
        showDialog
    }
    document.onkeydown = keyDown;
    hasInitMdEditor = true;
}