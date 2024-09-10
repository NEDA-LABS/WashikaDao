var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
let MemberDetails = class MemberDetails {
};
__decorate([
    PrimaryGeneratedColumn()
], MemberDetails.prototype, "memberId", void 0);
__decorate([
    Column()
], MemberDetails.prototype, "phoneNumber", void 0);
__decorate([
    Column()
], MemberDetails.prototype, "nationalIdNo", void 0);
__decorate([
    Column()
], MemberDetails.prototype, "memberRole", void 0);
__decorate([
    Column()
], MemberDetails.prototype, "memberAddr", void 0);
__decorate([
    Column()
], MemberDetails.prototype, "daoMultiSig", void 0);
MemberDetails = __decorate([
    Entity()
], MemberDetails);
export { MemberDetails };
