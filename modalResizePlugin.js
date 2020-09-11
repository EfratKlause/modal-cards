export class ModalResizePlugin {
    active = false;
    constructor(instance) {
        this.active = true;
    }
    
    init(instance) {
        let plugInClass = instance._modalRef;
        plugInClass.classList.add('resize');
        console.log('before init resize');
    }
}