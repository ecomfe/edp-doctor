/**
 * @file [Please Input File Description]
 * @author chestnutchen(chenli11@baidu.com)
 */

define( function ( require ) {
    var Action = require( 'ecma/mvc/BaseAction' );
    var u = require( 'underscore' );
    var locator = require('er/locator');

    /**
     * 多表单容器
     * @constructor
     */
    function ValidationCreateStepFormContainer() {
        Action.apply( this, arguments );
    }
    
    ValidationCreateStepFormContainer.prototype.modelType = require( './StepFormContainerModel' );
    ValidationCreateStepFormContainer.prototype.viewType = require( './StepFormContainerView' );

    ValidationCreateStepFormContainer.prototype.submitMultiForm = function (e) {
        var view = this.view;
        var model = this.model;
        var submitRequester = model.submitRequester;
        var valid = true;
        var tempData = null;
        var enterpriseFormData = null;
        var formDatas = {"options": []};
        var submitFormDatas = {
            "id": model.get('id') || '',
            "qualificationInfo": '',
            "type": e.type
        };
        view.disableSubmit();

        // TODO: 写得好丑，排期太紧了，等用Deferred改造一下
        u.every(view.childActions, function (panel) {
            if (valid) {
                var childView = panel.action.view;
                var childModel = panel.action.model;
                var submitData = childModel.getSubmitData(childView.getFormData());
                if (submitData.enterpriseType) {
                    enterpriseFormData = submitData;
                }
                else {
                    formDatas.options.push(submitData);
                }

                var validation = childModel.validateSubmitData(submitData);
                if (!childView.get('form').validate() || validation !== true) {
                    valid = false;
                    if (typeof validation === 'object') {
                        childView.notifyErrors(validation);
                    }
                    return false;
                }
            }
            return true;
        });
        if (valid) {
            if (!model.get('update')) {
                submitFormDatas.qualificationInfo = JSON.stringify(formDatas);
            }
            else {
                if (enterpriseFormData) {
                    submitFormDatas.qualificationInfo =
                        JSON.stringify({
                            "enterpriseInfo": enterpriseFormData,
                            "industryInfo": formDatas.options
                        });
                }
                else {
                    submitFormDatas.qualificationInfo =
                        JSON.stringify({
                            "industryInfo": formDatas.options
                        });
                }
            }
            submitRequester(submitFormDatas).then(
                u.bind(this.handerSumbitResult, this),
                u.bind(this.handerSumbitError, this)
            );
        }
        else {
            //不正确就释放操作
            view.enableSubmit();
        }
    };
    
    ValidationCreateStepFormContainer.prototype.initBehavior = function () {
        var action = this;
        var model = this.model;
        var view = this.view;
        var defaultData = model.get('defaultData');
        if (model.get('update')) {
            // 更新
            if (defaultData.enterpriseInfo) {
                // 有的话添加主体资质的表单
                view.maxFormCount = 21;
                view.addOneForm({
                    url: model.enterpriseUrl + '&id=' + defaultData.enterpriseInfo.id,
                    id: 'enterpriseForm',
                    options: {
                        defaultFormData: defaultData.enterpriseInfo
                    },
                    hasDeleteEvent: false
                });
            }
            // 添加行业资质的表单
            view.addForms(defaultData.industryInfo, model.industryUrl);
        }
        // 新建或编辑
        else {
            if (defaultData.qualificationInfo.length > 0) {
                view.addForms(defaultData.qualificationInfo, model.industryUrl);
            }
            else {
                view.addOneForm({
                    url: model.increasingUrl,
                    hasDeleteEvent: true
                });
            }
        }

        view.on('save', u.bind(action.submitMultiForm, action));

        view.on('submit', u.bind(action.submitMultiForm, action));

        view.on('delete', u.bind(action.delelteChildAction, action));
    };

    ValidationCreateStepFormContainer.prototype.delelteChildAction = function (e) {
        var formData = this.view.childActions[e.id].action.view.getFormData();
        var deleteRequester = this.model.deleteRequester;
        this.view.disableSubmit();
        if (formData.id) {
            deleteRequester({id: this.model.get('id'), licenseId: formData.id})
                .then(
                    u.bind(this.view.deleteForm, this.view),
                    u.bind(this.handDeleteError, this)
                );
        }
        else {
            this.view.deleteForm(e);
        }
    };

    ValidationCreateStepFormContainer.prototype.handDeleteError = function () {
        this.view.showToast('删除失败');
        this.view.enableSubmit();
        return;
    };

    ValidationCreateStepFormContainer.prototype.handerSumbitError = function () {
        this.view.showToast('保存失败');
        this.view.enableSubmit();
        return;
    };

    ValidationCreateStepFormContainer.prototype.handerSumbitResult = function (result) {
        this.view.showToast('保存成功');
        this.redirectAfterSubmit();
        return;
    };

    ValidationCreateStepFormContainer.prototype.redirectAfterSubmit = function () {
        var id = this.model.get('id');
        if (this.model.get('update')) {
            locator.redirect('/validation/list');
        }
        else {
            if (this.model.get('edit')) {
                locator.redirect('/validation/create/stepValidate~id=' + id + '&edit=1');
            }
            else {
                locator.redirect('/validation/create/stepValidate~id=' + id);
            }
        }
    };

    require( 'er/util' ).inherits( ValidationCreateStepFormContainer, Action );
    return ValidationCreateStepFormContainer;
} );
