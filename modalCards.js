

/** Service Class for assigning events to a given reference element. */
class EventManager {
    /** 
     * @property {array} events 
     */
    _events = {};

    
    /**
     * Create an eventManager object.
     */
    constructor() {}
    
    /**
     * Create an event to be assigned to reference element and insert it to the _events property.
     * @param {string} eventName - The name of the event to be added to the array.
     * @param {string} eventType - What event should be executed.
     * @param {property} ref - The HTML element attached to this property.
     * @param {function} callback - What should happen after the event fire.
     */
    add(eventName, eventType, ref, callback) {
        // add event listener
        ref.addEventListener(eventType, callback);
        // create function to remove event when called (=='unsubscribe')
        this._events[eventName] = () => ref.removeEventListener(eventType, callback);
    }

    /**
     * Remove event from the events array.
     * @param {string} eventName - The name of the event to be removed from the array.
     */
    remove(eventName) {
        // triger the function to remove event listener we created above
        this._events[eventName]();
        // remove event from _event obj
        delete this._events[eventName];
    } 

    /**
     * Deletes all the events in the array.
     */
    removeAll() {
        // return array with all names stored 
        Object.keys(this._events).map(x => this.remove(x));
    }
}



/**
 * Default modal values.
 * @typedef {function} onClose
 * @typedef {function} onOpen
 * @typedef {function} onClose
 * @typedef {function} beforeOpen
 * @typedef {function} beforeClose
 * @typedef {boolean} header
 * @typedef {boolean} footer
 * @typedef {array} cssClass
 * @typedef {string} closeLabel
 * @typedef {array} closeMethods
 */
let DEFAULT_VALUES = {
    onClose: null, 
    onOpen: null,
    beforeOpen: null, 
    beforeClose: null,
    header: false,
    footer: false,
    cssClass: [],
    closeLabel: 'close',
    closeMethods: ['overlay', 'button'],
}



/** Class for creating html modal structure and init. */
class Modal {
    plugins = [];
    options = null;
    _overlayRef = null;
    _modalRef = null;
    _headerRef = null;
    _contentRef = null;
    _footerRef = null;
    _title = 'null';
    _headerBtnWrapper = null;
    _footer = 'null';
    _footerBtnWrapper = null;
    _eventManager = new EventManager();

    constructor(options) {
        // extends config
        this.options = {...DEFAULT_VALUES, ...options}; 
        // init modal
        //this.init();
    }
    
    init() {
        this.build();
        // insert modal in dom
        document.body.insertBefore(this._overlayRef, document.body.firstChild);
        
        this.publish('beforeInit', this);
        this.publish('init', this);
    }

    build() {
        //overlay wrapper
        this._overlayRef = document.createElement('div');
        this._overlayRef.classList.add('overlay-class');
        this._overlayRef.style.display = 'none';
        
        // close with overlay
        if(this.options.closeMethods.indexOf('overlay') !== -1) { 
            this._eventManager.add('closeModalWithOverlay', 'click', this._overlayRef, (e) => {
                if(e.target == this._overlayRef) {
                    this.closeModal();
                }
            })
        }
        
        // insert custom class
        this.options.cssClass.forEach(function (item) {
            if (typeof item === 'string') {
            this._overlayRef.classList.add(item)
        }
        }, this)
        
        
        // create modal
        this._modalRef = document.createElement('div');
        this._modalRef.classList.add('modal-class');
        
        
        // create header
        if (this.options.header) {
            this._headerRef = document.createElement('div');
            this._headerRef.classList.add('header-class');
            this._title = document.createElement('h3');
            this._title.classList.add('modal-title');
            this._headerBtnWrapper = document.createElement('div');
            this._headerBtnWrapper.classList.add('modal-header-btn');
            
            this._headerRef.appendChild(this._title);
            this._headerRef.appendChild(this._headerBtnWrapper);
            this._modalRef.appendChild(this._headerRef);
        }
        
        
        // create content box
        this._contentRef = document.createElement('div');
        this._contentRef.classList.add('content-class');
        
        this._modalRef.appendChild(this._contentRef);
        
        this._modalRef.appendChild(this._contentRef);
        this._overlayRef.appendChild(this._modalRef);
        
        // create footer
        if (this.options.footer) {
            this._footerRef = document.createElement('div');
            this._footerRef.classList.add('footer-class');
            this._footer = document.createElement('h3');
            this._footer.classList.add('modal-footer');
            this._footerBtnWrapper = document.createElement('div');
            
            this._footerRef.appendChild(this._footer);
            this._footerRef.appendChild(this._footerBtnWrapper);
            this._modalRef.appendChild(this._footerRef);
        }
        
    }

    /**
     * Assign the plugins to the modals
     * @param  {String} evName - the breakpoints of the app
     * @param  {params} params - data sent by the publisher
     */
    publish(evName, params) {
     this.plugins.forEach(plugin => {
         if(plugin[evName]) {
         plugin[evName](params);
       }
      });
    }  
           
         
    
    //
    // API methods
    // 

    /**
     * Set modal header Html element
     * @param  {String} header [the header to be set by the user]
     */
    setHeader(header) {
        // check if type of footer string or node
        if (typeof header === 'string') {
            this._title.innerHTML = header;
        } else {
            this._title.innerHTML = '';
            this._headerRef.appendChild(header);
        }
    }

    
    /**
     * Set modal content Html element
     * @param  {String} content [the content to be set by the user]
     */
    setContent(content) {
        // check if type of content string or node
        if (typeof content === 'string') {
            this._contentRef.innerHTML = content;
        } else {
            this._contentRef.innerHTML = '';
            this._contentRef.appendChild(content);
        }
    } 


    /**
     * Set modal footer Html element
     * @param  {String} footer [the footer to be set by the user]
     */
    setFooter(footer) {
        // check if type of footer string or node
        if (typeof footer === 'string') {
            this._footer.innerHTML = footer;
        } else {
            this._footer.innerHTML = '';
            this._footerRef.appendChild(footer);
        }
    }


    
    
    openModal() {
        this._overlayRef.style.display = 'flex';
    } 

    closeModal() {
        // reaction to callback 
        // todo: make sure its a function
        // can provide params
        if (this.options.onClose) {
            this.options.onClose(this.options, this._modalRef);
            //this.updateState({display: 'destroyed'});
        }
        this._overlayRef.style.display = 'none';
    }

    minimize() {
        this._contentRef.style.display = 'none';
        this._footerRef.style.display = 'none';
        this._modalRef.style.position = 'absolute';
        this._modalRef.style.bottom = '0';
        this._modalRef.style.left = '0';
        this._modalRef.style.padding = '0px';
        this._modalRef.style.width = '10%';
        this._headerBtnWrapper.style.display = 'none';
        this._eventManager.add('openMini', 'click', this._modalRef, (e) => this.maximize());
        
    }  

    maximize() {
        this._contentRef.style.display = 'flex';
        this._footerRef.style.display = 'flex';
        this._modalRef.style.position = 'relative';
        this._modalRef.style.bottom = 'none';
        this._modalRef.style.left = 'none';
        this._modalRef.style.padding = '30px';
        this._modalRef.style.maxWidth = '500px';
        this._headerBtnWrapper.style.display = 'block';
    }

    /**
     * Add header Btn
     * @param  {string} label       the label of the button when hover
     * @param  {string} cssClass    the name of class attached to button Html element
     * @param  {function} callback  the event to be called 
     * @return {object}             the button to be added
     */
    addHeaderBtn(label, cssClass, callback) {
    let btn = document.createElement('button');
    btn.classList.add('headerBtn');
    // set label
    btn.innerHTML = label;
    // bind callback
    btn.addEventListener('click', callback)

    if (typeof cssClass === 'string' && cssClass.length) {
      // add classes to btn
      cssClass.split(' ').forEach(function (item) {
        btn.classList.add(item)
      })
    }
    this._headerBtnWrapper.appendChild(btn)
    return btn
    }


    /**
     * Add footer Btn
     * @param  {string} label       the label of the button when hover
     * @param  {string} cssClass    the name of class attached to button Html element
     * @param  {function} callback  the event to be called 
     * @return {object}             the button to be added
     */
    addFooterBtn(label, cssClass, callback) {
    let btn = document.createElement('button');
    btn.classList.add('footerBtn');
    
    // set label
    btn.innerHTML = label
    // bind callback
    btn.addEventListener('click', callback)

    if (typeof cssClass === 'string' && cssClass.length) {
      // add classes to btn
      cssClass.split(' ').forEach(function (item) {
        btn.classList.add(item)
      })
    }
    this._footerBtnWrapper.appendChild(btn)
    return btn
    }

    // add plugins to modal object
    extend(plugin) {
    this.plugins.push(new plugin(this));
    }
}




