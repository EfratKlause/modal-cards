export class ModalDragPlugin  { 
  active = false;
  modalref = null;
  constructor(instance) {
      this.active = true;
      this.modalref = instance;
  }

  init() {
    this.modalref._modalRef.classList.add('drag');
    this.modalref._modalRef.setAttribute('draggable', 'true');  
    this.modalref._eventManager.add('whenDrag', 'dragend', this.modalref._modalRef, this.drag_end);
  }
    
   drag_end(e) {
     let x = e.pageX; // where on the page the object was droped
     let y = e.pageY -50; // center of top position 
     e.target.style.left = x + 'px'; // change the value of coordinates to fit to new ones
     e.target.style.top = y + 'px'; 
    }

  beforeInit() {
    console.log('before init drag and drop');
  }

  minimize() {
    this.active = false;
  }
  open() {
    this.active = true;
  }
}

