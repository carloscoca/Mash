var Limz = function(config){
    "use strict";

    var _this = this;

    _this.popupCount = 0;


    if(config.admin === true){
        window.CKEDITOR.disableAutoInline = true;
    }

    this.config = config;
    this.config.userCanSave = false;
    this.config.unchanged = true;
    this.config.linkedFolder = _this.config.pageSettings.basic.linkedFolder;

    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
        is_explorer = navigator.userAgent.indexOf('MSIE') > -1,
        is_firefox = navigator.userAgent.indexOf('Firefox') > -1,
        is_safari = navigator.userAgent.indexOf("Safari") > -1;

    this.config.browser = {
        type:''
    };

    if(is_explorer){
        this.config.browser.type = 'IE';
    }


    Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    this.init = function(){

        _this.object = new window.Limz_Object(_this);
        _this.helper = new window.Limz_Helper(_this);
        _this.responsive = new window.Limz_Responsive(_this);
        _this.GoogleMaps = window.Limz_GoogleMaps;

        if(config.admin === true){
            _this.api = new window.Limz_Api(_this);
            _this.browserChecker = new window.Limz_BrowserChecker(_this);
            _this.browserChecker.checkBrowser();
        }

        if(config.admin === true){
            instantiateBackClasses();
            instantiateModules();
            _this.widgets = config.widgets;

            _this.load();
            _this.adminBar.init();

            var enduringContext = new _this.context(_this);
            enduringContext.createEnduring();

            setListeners();

            _this.wpAdmin.init();
        }

        window.Limz_SetupFront(_this);
        _this.responsive.init();

        if(config.admin === true){
            window.CKEDITOR.dtd.$removeEmpty.span = false;
        }

    };

    function instantiateModules(){
        _this.modules = {};
        var moduleTypes = _this.config.moduleTypes;
        for(var i = 0; i < moduleTypes.length; i++){
            instantiateModule(moduleTypes[i]);
        }
    }

    function instantiateModule(myModule){
        var name = myModule.name,
            templates = myModule.templates,
            className = "Limz_Module_" + name;

        if(window[className]){

            _this.modules[name] = new window[className](_this);

            for(var templateName in templates){
                if(templates.hasOwnProperty(templateName)){
                    _this.modules[name].templates[templateName] = myModule.templates[templateName];
                }
            }

        } else {
            console.log(className +" is not properly designed");
        }
    }

    function instantiateBackClasses(){
        _this.wpAdmin = new window.Limz_WpAdmin(_this);

        _this.popup = window.Limz_Popup;
        _this.pagePicker = window.Limz_PagePicker;
        _this.fileBrowser = window.Limz_FileBrowser;
        _this.context = window.Limz_Context;
        _this.settingManager = window.Limz_SettingManager;
        _this.elementManager = window.Limz_ElementManager;

        _this.templates = new window.Limz_Templates();
        _this.snippets = window.Limz_Snippets(_this.config.language);


        _this.module = new window.Limz_Module(_this);
        _this.editor = new window.Limz_Editor(_this);

        _this.block = new window.Limz_Block(_this);
        _this.image = new window.Limz_Image(_this);
        _this.link = new window.Limz_Link(_this);
        _this.sample = new window.Limz_Sample(_this);
        _this.container = new window.Limz_Container(_this);
        _this.button = new window.Limz_Button(_this);
        _this.slider = new window.Limz_Slider(_this);
        _this.accordion = new window.Limz_Accordion(_this);
        _this.customFunction = new window.Limz_CustomFunction(_this);
        _this.widget = new window.Limz_Widget(_this);
        _this.youtube = new window.Limz_YouTube(_this);
        _this.slideShare = new window.Limz_SlideShare(_this);
        _this.shareButton = new window.Limz_ShareButton(_this);

        _this.table = new window.Limz_Table(_this);
        _this.tr = new window.Limz_Tr(_this);
        _this.td = new window.Limz_Td(_this);

        _this.h = new window.Limz_H(_this);
        _this.p = new window.Limz_P(_this);
        _this.a = new window.Limz_A(_this);
        _this.ul = new window.Limz_Ul(_this);

        _this.tabs = new window.Limz_Tabs(_this);
        _this.sortable = new window.Limz_Sortable(_this);
        _this.draggable = new window.Limz_Draggable(_this);


        _this.adminBar = new window.Limz_AdminBar(_this);
        _this.view = new window.Limz_View(_this);
        _this.addSection = new window.Limz_AddSection(_this);
        _this.widgetCreator = new window.Limz_WidgetCreator(_this);
        _this.templateListeners = new window.Limz_TemplateListeners(_this);
        _this.widgetManager = new window.Limz_WidgetManager(_this);
        _this.validation = new window.Limz_Validation(_this);
        _this.converter = new window.Limz_Converter(_this);


        _this.interfaces = {};
        _this.interfaces.input = new window.Limz_Interface_Input(_this);
        _this.interfaces.checkbox = new window.Limz_Interface_Checkbox(_this);
        _this.interfaces.select = new window.Limz_Interface_Select(_this);
        _this.interfaces.textArea = new window.Limz_Interface_TextArea(_this);
        _this.interfaces.markupEditor = new window.Limz_Interface_MarkupEditor(_this);

        _this.interfaces.link = new window.Limz_Interface_Link(_this);
        _this.interfaces.sorting = new window.Limz_Interface_Sorting(_this);

        _this.interfaces.inputAttribute = new window.Limz_Interface_InputAttribute(_this);
        _this.interfaces.selectClass = new window.Limz_Interface_SelectClass(_this);
        _this.interfaces.textAreaAttribute = new window.Limz_Interface_TextAreaAttribute(_this);
        _this.interfaces.symbolClass = new window.Limz_Interface_SymbolClass(_this);

        _this.interfaces.addContainer = new window.Limz_Interface_AddContainer(_this);
        _this.interfaces.colorPicker = new window.Limz_Interface_ColorPicker(_this);
        _this.interfaces.filePicker = new window.Limz_Interface_FilePicker(_this);
        _this.interfaces.folderPicker = new window.Limz_Interface_FolderPicker(_this);

        _this.settings = window.Limz_Settings(_this);
    }

    this.changeContent = function(){
        _this.config.unchanged = false;
    };

    function setListeners(){
        $('.limz').on('contextmenu', function(event){
            _this.helper.openContext(event);
        });

        _this.templateListeners.setListeners();

        $(window).bind("beforeunload", function() {
            var editorInstances = window.CKEDITOR.instances;

            for(var editorId in editorInstances){
                if(editorInstances.hasOwnProperty(editorId)){
                    if(editorInstances[editorId].checkDirty()){
                        _this.config.unchanged = false;
                    }
                }
            }

            if(_this.config.unchanged === false){
                var reply = _this.snippets.doYouReallyWantToLeaveThisPage_SomeChangesYouMadeHaveNotBeenSavedYet;
                return reply;
            }

        });

    }


    this.load = function(){
        $('.limz').each(function(){
            var block = $(this);
            _this.block.load(block);
        });
    };

    this.capture = function(){
        $('.limz').each(function(){
            var block = $(this);
            _this.block.capture(block);
        });
    };
};