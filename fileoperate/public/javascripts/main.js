var cm = {};

var doctypeMap = {
	'HTML5': '<!DOCTYPE html>'
	,'HTML 4.01 Strict': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
	,'HTML 4.01 Transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'
	,'HTML 4.01 Frameset': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">'
	,'XHTML 1.0 Strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
	,'XHTML 1.0 Transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
	,'XHTML 1.0 Frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'
	,'无': ''
};

/**
 * 在iframe中预览html内容
 * @param html html内容字符串
 * @param blank 是否在新窗口中打开
 */
function preview(html, blank){
	if( blank ){
		var win = window.open("", "_blank");
		win.opener = null;
		win.document.write( html );
		win.document.close( );
	}else{
		var iframe = document.getElementById("preview");
		if( iframe ){
			d = iframe.contentWindow.document;
			d.open( );
			d.write( html );
			d.close( );
		}
	}
};

/**
 * 将脚本代码或脚本文件转为一个script标签 
 * @param code
 * @param src
 * @param type
 * @returns {String}
 */
function script( code, src, type ){
	var html = '';
	if(code || src){
		type = type || 'javascript';
		type = ' type="text/' + type + '"';
		src =  src ? ' src="' + src + '"' : '';
		code = code ? '\n' + code + '\n' : '';
		html = '<script' + type + src + '>' + code + '</script>';
	}
	return html;	
}

/**
 * 将css代码或css文件转为一个style或link标签
 * @param code {String} 
 * @param href {String} 
 * @returns {String}
 */
function style(code, href){
	var html = '';
	if( code ){
		html = [ '<style type="text/css">', code, '</style>' ].join('\n'); 
	}else if(href){
		html = '<link rel="stylesheet" type="text/css" href="' + href + '" />';		
	}
	return html;	
}

/**
 * 将一个表示HTML结构的对象，转化为html字符串
 * @param map
 * @returns {String}
 */
function htmlWrapper( map ){
	if( map == null )
		return '';
	var type = typeof map;
	if(type === "string"){
		return map;
	}
	if(type === "object"){
		var html = '';
		for(var i in map){
			var content = htmlWrapper(map[i]);
			if( isNaN(i) )
				html +=	['<' + i + '>', content, '</' + i + '>'].join('');
			else
				html += content;
		}
		return html;
	}
};

/**
 * 获取所有资源文件的html字符串
 */
function getAllRes(forAjax){
	var res = [ ];
	$("#libsList a").each(function(){
		if(forAjax){
			var linkHtml = this.outerHTML;
			if( !linkHtml ){
				var $me = $(this);
				linkHtml = $me.wrap('<span/>').parent().html();
				$me.unwrap();
			}
			res.push( linkHtml );						
		}else{
			var url = this.href, queryPos = url.lastIndexOf('?');
			var uri = queryPos > -1 ? url.substring(0, queryPos) : url;
			res.push( uri.slice( -4 ) == ".css" ? style("", url) : script("", url) );			
		}
	});
	return res.join('\n');
}

/**
 * 获取所有的设置选项
 * @returns 
 */
function setting(k, v){
	var map = { 
		blank: "#newTab"
		// title: "#title", 
		// lang: "#language", 
		// listenError: "#listenError",
		// disableSame: "#disableSameFile", 
		// doc: "#docType"
	};
	var forAjax = k === "forAjax";
	if(forAjax || arguments.length == 0){
		var s = {};
		for(var i in map){
			var $dom = $(map[i]);
			if( $dom.is(":checkbox") ){
				s[i] = $dom.prop("checked");
			}else {
				s[i] = $dom.val();								
			}
		}
		s.res = getAllRes(forAjax);
		return s;
	}else{
		if( !k in map )
			return;
		var $dom = $( map[k] );
		var isCheckbox = $dom.is(":checkbox");
		if( arguments.length > 1 ){
			isCheckbox ? $dom.prop("checked", v) : $dom.val( v );
		}else{
			return isCheckbox ? $dom.prop("checked") : $dom.val();
		}
	}
}

/**
 * 将所有页面内容封装为一个完整的html字符串
 * @returns {String}
 */
function html( s ){
	if( typeof s !== "object" ) s = { };
	s.encoding = s.encoding || 'UTF-8';
	s.doc = s.doc || 'HTML5';
	s.title = s.title || '代码在线编辑工具';
	var listenError = s.listenError ? 'window.onerror = function(msg, url, line){ alert("第 " + line + " 行脚本代码出错:\\n" + msg); };' : '';
	var struct = {
		1: doctypeMap[s.doc] || '',
		'html' : {
			'head':{
				1: '<title>' + s.title + '</title>'
				,2: s.doc == 'HTML5' ? '<meta charset="' + s.encoding + '">' : '<meta http-equiv="Content-Type" content="text/html; charset=' + s.encoding + '">'
				,3: script( listenError )
				,4: s.res
				,5: style( s.css )
			},
			'body': {
				1: s.html
				,2: script( s.js )
			}
		}
	};
	return htmlWrapper(struct);
};

/**
 * 更改模式
 * @param mode
 */
function changeMode(mode){
	var realMode = mode, $hide = null, $show = null, $me = $('#html');
	var $fieldset = $('div.column');
	if(mode == "htmlmixed") {
		mode = 'HTML';
		$show = $('#pre');
		$fieldset.css('width', '50%');
		$('#html_window,#preview_window').css('height', '100%');
	}

	$me.prop("checked", true).show().next().html( mode.toUpperCase() ).show();		
	cm.html && cm.html.setOption("mode", realMode);
}

// 初始化代码块编辑器配置
function init() {
    var langs = {html: 'text/html'};
    var keyMap = {
        "Alt-/": "autocomplete" // 代码提示
        ,"F11": function(e) {   // 全屏
            e.setOption("fullScreen", !e.getOption("fullScreen"));
        }
        ,"Esc": function(e) {   // 退出全屏
            if ( e.getOption("fullScreen") ) e.setOption("fullScreen", false);
        }
        ,"Ctrl-J": "toMatchingTag"
        ,"Shift-Ctrl-/": function(e){   // 代码块注释
            e.blockComment();
        }
        ,"Shift-Ctrl-\\": function(e){  // 代码块注释取消
            e.blockComment(false);
        }
        ,"Ctrl-F": function(e){   // 代码格式化
            e.formatCode();
        },"Ctrl-R": function(e) {   // 代码运行快捷
            var s = setting();
            preview(cm.html.getValue(), s.blank);
        }
    };

    // 初始化代码块编辑器
    for(var i in langs){
        var options = {
            mode: "javascript"
            ,theme: "monokai"
            ,indentUnit: 4 // 缩进
            ,smartIndent: true // 智能缩进
            ,tabSize: 4 // Tab键
            ,indentWithTabs: true // 将对应空格数替换为Tab缩进
            ,electricChars: true // 将对应空格数替换为Tab缩进
            // ,specialChars: RegExp // 将符合正则表达式的内容替换为指定的占位元素
            // ,specialCharPlaceholder: function(char)->Element // 根据传入的字符串返回指定的占位元素
            ,extraKeys: keyMap  // 额外的快捷键设置
            ,lineWrapping: true // 自动换行
            ,lineNumbers: true // 显示行号
            // ,firstLineNumber: 1 // 第一行行号
            // ,lineNumberFormatter: function(lineNumber)->string // 行号格式化器
            // ,gutters: [className, className] // 行号栏格外的css类名
            // ,fixedGutter: true // 固定行号栏
            // ,readOnly: false // 是否只读
            // ,undoDepth: 200 // 撤销深度(最大撤销次数)
            // ,autofocus: false // 自动获得焦点
            // ,dragDrop: false // 是否可拖拽
            // ,cursorBlinkRate: 530 // 光标闪动频率(多少毫秒闪动一次)

            ,styleActiveLine: true // 当前行高亮
            ,autoCloseBrackets: true // 自动关闭括号
            ,autoCloseTags: true // 自动关闭标签
            // ,matchTags: { bothTags: true }
            ,matchBrackets: true
            ,foldGutter: true
            ,gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        };

        if(typeof settings === "object"){
            for(var j in settings){
                options[j] = settings[j];
            }
        }
        options.mode = langs[i];
        cm[i] = CodeMirror.fromTextArea(document.getElementById( i + "_code" ), options);
    };

    // 第一次页面加载时默认选择一个视图模板
    var _lis = $('.file_node');
    if(_lis.length) {
        for(var i = 0; i < _lis.length; i++) {
            if($(_lis[i]).attr('class').indexOf('active') >= 0) {
                var filePath = $($(_lis[i]).children()[0]).attr('title');
                $.ajax({
                    type: 'get',
                    url: '/file',
                    data: {
                        'filename': filePath
                    },
                    success: function(data) {
                        cm.html.setValue(data);
                        preview( cm.html.getValue());
                    }
                });
            }
        }
    }
}

// 获取表示选中内容的Range对象
CodeMirror.prototype.getSelectedRange = function( ) {
	return { from: this.getCursor(true), to: this.getCursor(false) };
};

// 选中所有
CodeMirror.prototype.selectAll = function( ) {
	CodeMirror.commands.selectAll( this );
};

// 格式化选中内容
CodeMirror.prototype.formatCode = function() {
    var range = this.getSelectedRange();
    if(range.from.ch ==  range.to.ch && range.from.line == range.to.line){
    	this.selectAll();
    	range = this.getSelectedRange();    	
    }
    this.autoFormatRange(range.from, range.to);
};

// 注释或取消注释
CodeMirror.prototype.blockComment = function( isComment ) {
	isComment = isComment !== false;
	var range = this.getSelectedRange();
	this.commentRange(isComment, range.from, range.to);
};

// 页面加载完毕
$(function(){
	
	// 监测窗口大小改变
	$(window).resize(function(){
		var $me = $(this);
		$('#main').height($me.height() - 80);
		$('#helpInfo').toggle( $me.width() >= 960 );
	}).trigger('resize');
    init();

    // 有内容修改实时刷新视图
    $('.CodeMirror').on('keyup mousedown', function(){
        var s = setting();
        preview(cm.html.getValue(), s.blank);
    });

	// 格式化代码
	$('.j_format_code').on('click', function(){
		for(var i in cm){
			cm[i].formatCode();
		}
	});
	
	// 切换视图
	$('.j_warp_view').on('click', '[name=view]', function() {
		var id = this.value;
		var showOrHide = this.checked;
		var target = $("#" + id);

		if( id == "panel"){ // 面板
			var related = $("#content");
			var key = "marginLeft";

			if( showOrHide ){
				var left = related.data(key);
				if( left != null ){
                    related.css(key, left);
                }
			}else{
				var left = related.css(key);
				related.data(key, left).css(key, 0);
			}
			target.toggle(showOrHide);
		}else { // 编辑、预览
			var me = target.toggle(showOrHide).parent();
			var title = $(me.children()[0]);
			var children = $(me.children()[1]);
			var valids = children.filter(":visible");

			switch(valids.length){
				case 0:
					title.css("display", "none");
					me.css( "width", 0 );
					me.siblings("div.column").css("width", "100%");
					break;
				case 1:
					valids.css("height", "100%");
					title.css("display", "block");
					if( showOrHide ){
						me.siblings("div.column").andSelf().css("width", "50%");
					}
					break;
				case 2:
					valids.filter(".top").css("height", "40%");
					valids.filter(".bottom").css("height", "60%");
					break;
			}
		}
	});

	//初始化
	$('#theme,#language,#docType').each(function(){
		var $me = $(this);
		var defaultV = $me.attr("default");

		if( defaultV ){
			$me.val( defaultV );
			switch( this.id ){
				case 'language':
					if( defaultV != 'default' ){
						changeMode( defaultV );
					}
					break;
				case 'theme':
					if( defaultV != 'eclipse' )
						$me.trigger("change");
					break;
			}
		}
	});
	
	// 运行代码
	$("#runCode").on('click', function(){
		var s = setting();
		preview(cm.html.getValue(), s.blank);
	}).trigger("click");

    // 下载模板文件
    $('#downCode').on('click', function() {
        var code = cm.html.getValue().trim() || '';
        window.location.href = '/download?code=' + encodeURIComponent(code);
    });

    // 文件树切换效果
    $('.file_node').on('click', function() {
        var _me = $(this);
        var _lis = $('.file_node');
        var filePath = $(_me.children()[0]).attr('title');
        _lis.removeClass('active');
        _me.addClass('active');

        $.ajax({
            type: 'get',
            url: '/file',
            data: {
                'filename': filePath
            },
            success: function(data) {
                cm.html.setValue(data);
                preview( cm.html.getValue());
            }
        });
    });
});