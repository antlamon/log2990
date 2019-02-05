import { TestBed, inject } from "@angular/core/testing";

import { ModalService } from "./modal.service";
import {IModal} from "../models/modal";

let serviceInstance: ModalService;
describe("ModalService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService]
    });
  });

  it("should be created", inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));

  describe("Test for the functions", ()=>{
      beforeEach(() => {
        serviceInstance = new ModalService();
        });

      it("Adding a new IModal should increase the length of the array", ()=>{
        serviceInstance.add({id:"idTest",open:()=>{},close:()=>{}});
        expect(serviceInstance["modals"].findIndex(x=>x.id=="idTest")).not.toEqual(-1);
      });
      it("The function remove should correctly remove the IModal with the corresponding id form the array", ()=>{
        serviceInstance.add({id:"idTest",open:()=>{},close:()=>{}});
        serviceInstance.remove("idTest");
        expect(serviceInstance["modals"].findIndex(x=>x.id=="idTest")).toEqual(-1);
      });
      it("The function remove should remove the IModal of the corresponding id from the list", ()=>{
        serviceInstance.add({id:"idTest",open:()=>{},close:()=>{}});
        let oldLength: number = serviceInstance["modals"].length;
        serviceInstance.remove("idTest4");
        expect(serviceInstance["modals"].length == oldLength).toEqual(true);
      });
      it("Calling close on a specific id of an IModal should call the function close of this IModal exactly one time and not on the other IModal of the class", ()=>{
          let testToBeCalled:IModal = {id:"idTestCall",open:()=>{},close:()=>{}};
          let testToBeNotCalled:IModal = {id:"idTestUncall",open:()=>{},close:()=>{}};
          let calledSpy=spyOn(testToBeCalled,"close");
          let uncalledSpy=spyOn(testToBeNotCalled,"close");
          serviceInstance.add(testToBeCalled);
          serviceInstance.add(testToBeNotCalled);
          serviceInstance.close("idTestCall");
          expect(calledSpy).toHaveBeenCalledTimes(1);
          expect(uncalledSpy).toHaveBeenCalledTimes(0);
      });
      it("Calling open on a specific id of an IModal should call the function close of this IModal exactly one time and not on the other IModal of the class", ()=>{
        let testToBeCalled:IModal = {id:"idTestCall",open:()=>{},close:()=>{}};
        let testToBeNotCalled:IModal = {id:"idTestUncall",open:()=>{},close:()=>{}};
        let calledSpy=spyOn(testToBeCalled,"open");
        let uncalledSpy=spyOn(testToBeNotCalled,"open");
        serviceInstance.add(testToBeCalled);
        serviceInstance.add(testToBeNotCalled);
        serviceInstance.open("idTestCall");
        expect(calledSpy).toHaveBeenCalledTimes(1);
        expect(uncalledSpy).toHaveBeenCalledTimes(0);
    });
  });
});
