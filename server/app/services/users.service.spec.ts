// tslint:disable:no-unused-expression
import { expect } from "chai";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { User, UsersManager } from "./users.service";

describe("User service", () => {
    const service: UsersManager = container.get<UsersManager>(TYPES.UserManager);

    const mockedUser: User = {
        username: "testName",
        socketId: "1234",
    };

    beforeEach(() => {
        service["users"].push(mockedUser);
    });

    afterEach(() => {
        service["users"] = [];
    });

    it("Adding a user should add it to the array of user", () => {
        const nbUsers: number = service["users"].length;
        service.addUser("123abc");
        expect(nbUsers).to.be.lessThan(service["users"].length);
    });

    describe("Set username", () => {
        it("Trying to set username with wrong parameters should return false", () => {
            expect(service.setUserName(null, mockedUser.socketId)).to.be.false;
            expect(service.setUserName(mockedUser.username, null)).to.be.false;
            expect(service.setUserName("do not", "exist")).to.be.false;
        });

        it("Replacing a user username should return true and replace its username", () => {
            const username: string = "newUsername";
            expect(service.setUserName(username, mockedUser.socketId)).to.be.true;
            expect(mockedUser.username).to.equal(username);
        });
    });

    describe("Remove usename", () => {
        it("Trying to remove a user that doesnt exist should change the users", () => {
            expect(service.removeUser("")).to.be.false;
            expect(service["users"]).to.have.lengthOf(1);
        });

        it("Removing a user should remove it from users", () => {
            const user: User = {
                username: "test",
                socketId: "abc",
            };
            service["users"].push(user);
            expect(service.removeUser(user.socketId)).to.be.true;
            expect(service["users"]).to.have.lengthOf(1);
        });
    });

    describe("Get user", () => {
        it("Trying to get a user that doesnt exist should return null", () => {
            expect(service.getUser("")).to.be.null;
        });

        it("Getting a user should return it", () => {
            expect(service.getUser(mockedUser.username)).to.eql(mockedUser);
        });
    });

    describe("User exist", () => {
        it("Trying to find a user that doesnt exist should return false", () => {
            expect(service.userExist("")).to.be.false;
        });

        it("Finding a user should return true", () => {
            expect(service.userExist(mockedUser.username)).to.be.true;
        });
    });
});
