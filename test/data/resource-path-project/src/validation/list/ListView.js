/**
 * @file [Please Input File Description]
 * @author wangmin(wangmin02@baidu.com)
 */

define( function ( require ) {
    // require template
    require('tpl!./list.tpl.html');

    var BaseView = require( 'ecma/mvc/BaseView' );
    //var controller = require('er/controller');
    var locator = require('er/locator');
    var Dialog = require('esui/Dialog');
    var config = require('./config');
    var io = require('ecma/io/serverIO');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function ValidationListListView() {
        BaseView.apply( this, arguments );
    }
    
    ValidationListListView.prototype = {
        template: 'TPL_validation_list_list',

        uiProperties: {
            table: {
              sortable: true,
              columnResizable: true,
              followHead: true,
              breakLine: 1,
              select: 'none',
              noDataHtml: '<div class="no-data-guide">'
                            + '<div><a href="#/validation/create/stepEnterprise" class="create-btn">新建企业百科</a></div>' 
                            + '<div style="margin-top:10px;color:#525252;"><span>您还没有企业百科词条，快来创建吧！</span>'
                            + '<a target="_blank" href="http://baike.baidu.com/enterprise/index">了解更多</a></div>'
                            + '</div>',
              fields: [
                {
                    title: '词条名称',
                    field: 'name',
                    sortable: false,
                    tip: '词条名称',
                    resizable: true,
                    width: 100,
                    content: function(item) {
                        return item.name;
                    }
                },{
                    title: '词条状态',
                    field: 'status',
                    sortable: false,
                    tip: '词条状态',
                    resizable: true,
                    width: 100,
                    content: function(item) {
                        var statusMap = config.statusMap;

                        var colorStatusMap = config.colorStatusMap;

                        return '<span class="' + colorStatusMap[item.status] + '">' + statusMap[item.status] +'</span>';
                    }
                },{
                    title: '投放开始时间',
                    field: 'launchDate',
                    sortable: false,
                    resizable: true,
                    width: 100,
                    content: function(item) {
                        return item.launchDate || '--';
                    }
                },{
                    title: '付款金额',
                    field: 'payment',
                    sortable: false,
                    tip: '付款金额',
                    resizable: true,
                    width: 100,
                    content: function(item) {
                        return item.payment;
                    }
                },{
                    title: '词条操作',
                    field: '',
                    width: 100,
                    content: function(item) {
                        function getHtml(text, cmd) {
                            return '<a href="javascript:void(0)" style="margin-right:10px;" data-command="' + cmd + '" data-command-args="' + item.id + '">'
                                    + text + '</a>';
                        }

                        var optHtmlMap = {
                            'DRAFT' : getHtml('编辑', 'edit') + getHtml('删除','delete'),
                            'IN_AUDITING' : getHtml('查看', 'detail'),
                            'AUDIT_DENIED' : '',
                            'AUDIT_PASSED' : getHtml('查看', 'detail'),
                            'LAUNCHING' : getHtml('查看', 'detail'),
                            'LAUNCH_END' : getHtml('查看', 'detail'),
                            'LAUNCH_PAUSE' : getHtml('查看', 'detail')
                        };

                        var optHtml = '';

                        if (item.isUpdate && item.isUpdate === true) {
                            optHtml = optHtmlMap[item.status] + getHtml('更新有效期', 'update');
                        } else if (item.isModify && item.isModify === true) {
                            optHtml = optHtmlMap[item.status] + getHtml('修改', 'edit');
                        } else {
                            optHtml = optHtmlMap[item.status];
                        }

                        return optHtml;
                    }
                }
              ]
            }
        },

        uiEvents: {
            table: {
                command: function(e) {
                    var view = this;
                    var id = e.args;

                    switch (e.name) {
                        //查看并付款页面
                        case 'detail' :
                            locator.redirect('/validation/check~id=' + id + '&preview=1');
                            break;
                        //编辑（编辑和修改审批拒绝的）
                        case 'edit' :
                            locator.redirect('/validation/create/stepEnterprise~id=' + id + '&edit=1');
                            break;
                        //更新有效期
                        case 'update' :
                            locator.redirect('/validation/create/stepIndustry~id=' + id + '&update=1');
                            break;
                        case 'delete' :
                            Dialog.confirm({
                                'title' : '提示',
                                'content' : '您确定要删除该词条吗？',
                                'onok' : function () {
                                    io.post('/data/bk/word/delete', {"id" : id}).then(
                                        function () {
                                            config.api.listUrl().then(function (data) {
                                                view.get('table').setDatasource(data);
                                            });
                                            view.showToast('删除成功');
                                        }
                                    );
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };

    ValidationListListView.prototype.enterDocument = function () {
        var email = this.model.get('contactInfo').contactEmail1;

        if (!email) {
            Dialog.confirm({
                'title' : '系统提示',
                'content' : '您还没有填写邮箱信息，为保证您能及时收到企业百科认证的消息通知，'
                            + '请您务必在个人设置中填写邮箱信息。',
                'type' : 'warning',
                'onok' : function() {
                    locator.redirect('/setting');
                }
            });
        }

        BaseView.prototype.enterDocument.apply(this, arguments);
    };

    require( 'er/util' ).inherits( ValidationListListView, BaseView );
    return ValidationListListView;
} );
