var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
let Dao = class Dao {
};
__decorate([
    PrimaryGeneratedColumn()
], Dao.prototype, "id", void 0);
__decorate([
    Column()
], Dao.prototype, "daoName", void 0);
__decorate([
    Column()
], Dao.prototype, "daoLocation", void 0);
__decorate([
    Column()
], Dao.prototype, "targetAudience", void 0);
__decorate([
    Column()
], Dao.prototype, "daoTitle", void 0);
__decorate([
    Column()
], Dao.prototype, "daoDescription", void 0);
__decorate([
    Column()
], Dao.prototype, "daoOverview", void 0);
__decorate([
    Column()
], Dao.prototype, "daoImageIpfsHash", void 0);
__decorate([
    Column()
], Dao.prototype, "multiSigAddr", void 0);
Dao = __decorate([
    Entity()
], Dao);
export { Dao };
