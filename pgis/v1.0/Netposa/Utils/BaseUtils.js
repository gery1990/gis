
/*!
 * 基础工具
 */
(function() {
    var e = NPMapLib.Utils.BaseUtils = function() {
    };

    //创建错误异常
    e.prototype.createError = function(a, b) {
        if (b) {
            return new Error(a + "\r\nBecause :" + b.message)
        } else {
            return new Error(a)
        }
    };

    //添加可信任的url
    e.prototype.addtrusturl = function(url) {
        var WshShell = new ActiveXObject("WScript.Shell");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url, "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url + "\\www", "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url + "\\www\\http", "2", "REG_DWORD");
    };

    //弹出窗口的阻止程序
    e.prototype.popupwindow = function(url) {
        var WshShell = new ActiveXObject("WScript.Shell");
        //添加可信站点或IP
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\", "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\http", "2", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\:Range", url);
        //修改IE ActiveX 安全设置
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1001", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1004", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1200", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1201", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1405", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\2201", "0", "REG_DWORD");
        //禁用弹出窗口阻止程序
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows\\PopupMgr", "no");
    };

    //把当前打开的网址添加为可信任
    e.prototype.addtrustmyself = function() {
        this.addtrusturl(window.location.href);
    };

    //允许当前网址弹出窗口的阻止程序
    e.prototype.addpopwinmyself = function(){
        this.popupwindow(window.location.href);
    };

    //添加CSS文件
    e.prototype.addCSSFiles = function(cssFiles){
        if(!cssFiles || cssFiles.length <=0)
            return;

        var cssTags = new Array(cssFiles.length);
        for (var i=0, len=cssFiles.length; i<len; i++) {
            cssTags[i] = "<link type='text/css' rel='stylesheet' href = '" + host + cssFiles[i] + "'/> ";
        }
        if (cssTags.length > 0) {
            document.write(cssTags.join(""));
        }
    };

    //添加JS文件
    e.prototype.addJSFiles = function(jsFiles){
        if(!jsFiles || jsFiles.length <=0)
            return;

        var scriptTags = new Array(jsFiles.length);
        for (var i=0, len=jsFiles.length; i<len; i++) {
            scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>"; 
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
    };
})();