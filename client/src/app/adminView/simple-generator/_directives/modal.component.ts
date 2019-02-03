// import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

// @Component({
//     selector: 'modal',
//     template: '<ng-content></ng-content>'
// })

// export class ModalComponent implements OnInit, OnDestroy {
//     @Input() id: string;
//     private element: any;

//     constructor() {
//         // this.element = el.nativeElement;
//     }

//     ngOnInit(): void {
//         let modal = this;

//         // ensure id attribute exists
//         if (!this.id) {
//             console.error('modal must have an id');
//             return;
//         }

//         // move element to bottom of page (just before </body>) so it can be displayed above everything else
//         document.body.appendChild(this.element);

//         // close modal on background click
//         this.element.addEventListener('click', function (e: any) {
//             if (e.target.className === 'modal') {
//                 modal.close();
//             }
//         });

//     }

//     // remove self from modal service when directive is destroyed
//     ngOnDestroy(): void {
//         this.element.remove();
//     }

//     // open modal
//     open(): void {
//         this.element.style.display = 'block';
//         document.body.classList.add('modal-open');
//     }

//     // close modal
//     close(): void {
//         this.element.style.display = 'none';
//         document.body.classList.remove('modal-open');
//     }
// }