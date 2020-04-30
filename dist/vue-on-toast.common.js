/**
  * vue-on-toast v1.0.1
  * (c) 2020 Stabzs
  * @license MIT
  */
'use strict';

var ToastServiceBus;

function installBus(_Vue) {
  if (!_Vue) {
    throw new Error('Vue is not installed')
  }

  ToastServiceBus = new _Vue();
  ToastServiceBus.subscribers = [];
}

var v = 'vot';

// Toast Types
var types = {
  success: 'success',
  error: 'error',
  info: 'info',
  wait: 'wait',
  warning: 'warning'
};

// Events
var ADD_TOAST = 'addToast';
var REMOVE_TOAST = 'removeToast';
var REMOVE_TOAST_BY_TYPE = 'removeToastByType';

// Toast Type style class names
var SUCCESS_TYPE_CLASS = v + '-' + types.success;
var ERROR_TYPE_CLASS = v + '-' + types.error;
var INFO_TYPE_CLASS = v + '-' + types.info;
var WAIT_TYPE_CLASS = v + '-' + types.wait;
var WARNING_TYPE_CLASS = v + '-' + types.warning;

// Toast icon style class names
var SUCCESS_ICON_CLASS = v + '-icon-' + types.success;
var ERROR_ICON_CLASS = v + '-icon-' + types.error;
var INFO_ICON_CLASS = v + '-icon-' + types.info;
var WAIT_ICON_CLASS = v + '-icon-' + types.wait;
var WARNING_ICON_CLASS = v + '-icon-' + types.warning;

// Toast style class names
var TITLE_CLASS = v + '-title';
var BODY_CLASS = v + '-body';

// Container position style class names
var TOP_RIGHT_POSITION_CLASS = v + '-top-right';

var CLOSE_HTML = '<button class="toast-close-button" type="button">&times;</button>';

// Animation types
var animations = {
  FADE: 'fade',
  EASE_OUT_LEFT: 'ease-out-left',
  EASE_OUT_RIGHT: 'ease-out-right'
};

var Timer = {
  configureTimer: function configureTimer(toast) {
    var timeout = (typeof toast.timeout === 'number')
      ? toast.timeout
      : toast.toastConfig.timeout;

    if (typeof timeout === 'object') {
      timeout = timeout[toast.type];
    }

    if (timeout > 0) {
      toast.timeoutId = setTimeout(function () {
        ToastServiceBus.$emit(REMOVE_TOAST,
          toast.toastId, toast.toastContainerId);
      }, timeout);
    }
  }
}

function ToastConfig(toastConfig) {
  var toastConfigDefaults = {
    animation: animations.FADE,
    bodyClass: BODY_CLASS,
    closeHtml: CLOSE_HTML,
    defaultTypeClass: INFO_TYPE_CLASS,
    typeClasses: {
      error: ERROR_TYPE_CLASS,
      info: INFO_TYPE_CLASS,
      wait: WAIT_TYPE_CLASS,
      success: SUCCESS_TYPE_CLASS,
      warning: WARNING_TYPE_CLASS
    },
    iconClasses: {
      error: ERROR_ICON_CLASS,
      info: INFO_ICON_CLASS,
      wait: WAIT_ICON_CLASS,
      success: SUCCESS_ICON_CLASS,
      warning: WARNING_ICON_CLASS
    },
    mouseoverTimerStop: false,
    newestOnTop: true,
    positionClass: TOP_RIGHT_POSITION_CLASS,
    preventDuplicates: false,
    tapToDismiss: true,
    timeout: 5000,
    titleClass: TITLE_CLASS,
    toastContainerId: null,
    showCloseButton: false
  };

  toastConfig = Object.assign(toastConfigDefaults, toastConfig);

  toastConfig.typeClasses = Object.assign(
    toastConfigDefaults.typeClasses, toastConfig.typeClasses);

  toastConfig.iconClasses = Object.assign(
    toastConfigDefaults.iconClasses, toastConfig.iconClasses);

  return toastConfig
}

var BodyOutputType = {
  Component: 'Component',
  TrustedHtml: 'TrustedHtml'
}

var Toast = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:['toast', _vm.classes.typeClass],on:{"click":function($event){_vm.onClick(_vm.toast, $event);},"mouseover":function($event){_vm.stopTimer(_vm.toast);},"mouseout":function($event){_vm.restartTimer(_vm.toast);}}},[_c('i',{staticClass:"toaster-icon",class:_vm.classes.iconClass}),_vm._v(" "),_c('div',{staticClass:"toast-content"},[_c('div',{class:_vm.classes.titleClass},[_vm._v(_vm._s(_vm.toast.title))]),_vm._v(" "),_c('div',{class:_vm.classes.bodyClass},[(_vm.toast.bodyOutputType == _vm.bodyOutputType.Component)?_c(_vm.toast.body,{tag:"component"}):(_vm.toast.bodyOutputType == _vm.bodyOutputType.TrustedHtml)?_c('div',{domProps:{"innerHTML":_vm._s(_vm.toast.body)}}):(typeof _vm.toast.body === 'string')?_c('div',[_vm._v(_vm._s(_vm.toast.body))]):_vm._e()],1)]),_vm._v(" "),(_vm.toast.showCloseButton)?_c('div',{staticClass:"toast-close-button",domProps:{"innerHTML":_vm._s(_vm.toast.toastConfig.closeHtml)},on:{"click":function($event){_vm.onClick(_vm.toast, $event, true);}}}):_vm._e()])},staticRenderFns: [],
  name: 'toast',

  props: { toast: Object },

  computed: {
    classes: function classes() {
      return {
        typeClass: this.toast.toastConfig.typeClasses[this.toast.type],
        iconClass: this.toast.toastConfig.iconClasses[this.toast.type],
        titleClass: this.toast.toastConfig.titleClass,
        bodyClass: this.toast.toastConfig.bodyClass
      }
    },
    bodyOutputType: function bodyOutputType() {
      return BodyOutputType
    }
  },

  methods: {
    onClick: function(toast, event, isCloseButton) {
      event.stopPropagation();

      if (toast.toastConfig.tapToDismiss ||
        (toast.showCloseButton && isCloseButton)) {
        var removeToast = true;
        if (toast.clickHandler) {
          if (typeof toast.clickHandler === 'function') {
            removeToast = toast.clickHandler(toast, isCloseButton);
          } else {
            console.log('The toast click handler is not a callable function.');
            return false
          }
        }

        if (removeToast) {
          ToastServiceBus.$emit(REMOVE_TOAST, toast.toastId,
            toast.toastContainerId);
        }
      }
    },

    stopTimer: function (toast) {
      if (toast.toastConfig.mouseoverTimerStop) {
        if (toast.timeoutId) {
          window.clearTimeout(toast.timeoutId);
          toast.timeoutId = null;
        }
      }
    },

    restartTimer: function (toast) {
      if (toast.toastConfig.mouseoverTimerStop) {
        if (!toast.timeoutId) {
          Timer.configureTimer(toast);
        }
      } else if (toast.timeoutId === null) {
        ToastServiceBus.$emit(REMOVE_TOAST,
          toast.toastId,
          toast.toastContainerId
        );
      }
    }
  }
}

var ToastContainer = {
  name: 'toast-container',

  data: function () { return ({
    toasts: []
  }); },

  components: {
    'toast': Toast
  },

  props: ['toastConfig'],

  methods: {
    addToast: function addToast(toast, toastConfig) {
      toast.toastConfig = toastConfig;

      if (toast.toastContainerId && toastConfig.toastContainerId &&
        toast.toastContainerId !== toastConfig.toastContainerId) {
        return
      }

      if (!toast.type) {
        toast.type = toastConfig.defaultTypeClass;
      }

      if (toastConfig.preventDuplicates && this.toasts.length > 0) {
        if (toast.toastId &&
          this.toasts.some(function (t) { return t.toastId === toast.toastId; })) {
          return
        } else if (this.toasts.some(function (t) { return t.body === toast.body; })) {
          return
        }
      }

      this.setCloseOptions(toast, toastConfig);

      toast.bodyOutputType = toast.bodyOutputType || toastConfig.bodyOutputType;

      Timer.configureTimer(toast);

      if (toastConfig.newestOnTop) {
        this.toasts.unshift(toast);
        if (this.isLimitExceeded(toastConfig)) {
          this.toasts.pop();
        }
      } else {
        this.toasts.push(toast);
        if (this.isLimitExceeded(toastConfig)) {
          this.toasts.shift();
        }
      }

      if (toast.onShowCallback) {
        toast.onShowCallback(toast);
      }
    },

    setCloseOptions: function setCloseOptions(toast, toastConfig) {
      if (toast.showCloseButton === null ||
        typeof toast.showCloseButton === 'undefined') {
        if (typeof toastConfig.showCloseButton === 'object') {
          toast.showCloseButton = toastConfig.showCloseButton[toast.type];
        } else if (typeof toastConfig.showCloseButton === 'boolean') {
          toast.showCloseButton = toastConfig.showCloseButton;
        }
      }

      if (toast.showCloseButton) {
        toast.closeHtml = toast.closeHtml || toastConfig.closeHtml;
      }
    },

    isLimitExceeded: function isLimitExceeded(toastConfig) {
      return toastConfig.limit && this.toasts.length > toastConfig.limit
    },

    removeToast: function removeToast(toast) {
      if (toast === null || typeof toast === 'undefined') { return }
      var index = this.toasts.indexOf(toast);
      if (index < 0) { return }

      this.toasts.splice(index, 1);

      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
        toast.timeoutId = null;
      }

      if (toast.onHideCallback) {
        toast.onHideCallback(toast);
      }
    },

    removeToasts: function removeToasts(toastId, toastContainerId) {
      if (toastContainerId === null ||
        typeof toastContainerId === 'undefined' ||
        toastContainerId === this._toastConfig.toastContainerId) {
        if (toastId) {
          this.removeToast(this.toasts.filter(function (t) { return t.toastId === toastId; })[0]);
        } else {
          this.removeAllToasts();
        }
      }
    },

    removeAllToasts: function removeAllToasts(type) {
      var this$1 = this;
      if ( type === void 0 ) type = 'all';

      if (type === 'all') {
        for (var i = this.toasts.length - 1; i >= 0; i--) {
          this$1.removeToast(this$1.toasts[i]);
        }
      } else {
        this.toasts
          .filter(function (toast) { return toast.type === type; })
          .forEach(function (toast) { return this$1.removeToast(toast); });
      }
    }
  },

  computed: {
    _toastConfig: function _toastConfig() {
      return new ToastConfig(this.toastConfig)
    }
  },

  beforeMount: function beforeMount() {
    var this$1 = this;

    ToastServiceBus.subscribers.push(this);

    ToastServiceBus.$on(ADD_TOAST, function (toast) {
      this$1.addToast(toast, this$1._toastConfig);
    });

    ToastServiceBus.$on(REMOVE_TOAST,
      function (toastId, toastContainerId) {
        this$1.removeToasts(toastId, toastContainerId);
      });

    ToastServiceBus.$on(REMOVE_TOAST_BY_TYPE,
      function (type) {
        this$1.removeAllToasts(type);
      });
  },

  render: function render(h) {
    return h(
      'transition-group', {
        name: 'toast-container',
        tag: 'div',
        'class': ['toast-container', this._toastConfig.positionClass],
        props: {
          name: this._toastConfig.animation
        }
      }, this.toasts.map(function (toast) { return (h('toast', {
        'class': 'toast',
        props: {
          toast: toast
        },
        key: toast.toastId
      })); })
    )
  }
}

var ToastService = {
  /**
   * Synchronously create and show a new toast instance.
   *
   * @param {(string | Toast)} type The type of the toast, or a Toast object.
   * @param {string=} title The toast title.
   * @param {string=} body The toast body.
   * @returns {Toast}
   *    The newly created Toast instance with a randomly generated GUID Id.
   */
  pop: function pop(type, title, body) {
    var toast = typeof type === 'string' ? {
      type: type,
      title: title,
      body: body
    } : type;

    if (!toast || !toast.type || !toast.type.length) {
      throw new Error('A toast type must be provided')
    }

    if (ToastServiceBus.subscribers.length < 1) {
      throw new Error(
        'No Toaster Containers have been initialized to receive toasts.')
    }

    toast.toastId = Guid.newGuid();

    ToastServiceBus.$emit(ADD_TOAST, toast);

    return toast
  },

  /**
   * Removes a toast by toastId and/or toastContainerId.
   *
   * @param {string} toastId The toastId of the toast to remove.
   * @param {number=} toastContainerId
   *        The toastContainerId of the container to remove toasts from.
   */
  remove: function remove(toastId, toastContainerId) {
    ToastServiceBus.$emit(REMOVE_TOAST, toastId, toastContainerId);
  },

  /**
   * Removes all toasts by type
   *
   * @param {string} type The toast type to remove.
   */
  removeByType: function removeByType(type) {
    ToastServiceBus.$emit(REMOVE_TOAST_BY_TYPE, type);
  }
}

// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
var Guid = function Guid () {};

Guid.newGuid = function newGuid () {
  function match(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16)
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, match)
};

var _Vue;

function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true;

  _Vue = Vue;

  installBus(_Vue);

  Vue.component('ToastContainer', ToastContainer);

  Vue.prototype.$vueOnToast = {
    pop: ToastService.pop,
    remove: ToastService.remove
  };
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

var index = { install: install, ToastService: ToastService }

module.exports = index;
