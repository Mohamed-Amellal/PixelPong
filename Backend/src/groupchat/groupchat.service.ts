import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cron } from '@nestjs/schedule';
import { Groupchat, Messagegb, Requestjoingroup, User, usermute } from '@prisma/client';

@Injectable()
export class GroupchatService {

    constructor(
        private readonly prisma: PrismaService,
        private jwtService: JwtService,
    ) { }



    //get number user of a groupchat
    async numberuser(id: string): Promise<number> {
        try {
            const data = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    usersgb: true,
                },
            });
            return data.usersgb.length;
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //check if a user is a superuser of a groupchat
    async checksuperuser(id: string, iduserconnected: string): Promise<boolean> {
        try {
            const data = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    superadmin: true,
                },
            });
            if (data && data.superadmin.id == iduserconnected) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }
    
        // get one groupchat
        async findOne(id: string) : Promise<Groupchat> {
            try {
    
                const data = await this.prisma.groupchat.findUnique({
                    where: {
                        id: id,
                    },
                });
                if (data)
                    return data;
                else
                    throw new HttpException('Groupchat not found', HttpStatus.NOT_FOUND);
            }
            catch (error) {
                throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
            }
        }

    //get a all groupchat
    async findAllGp(): Promise<Groupchat[]> {
        try {
            const data = await this.prisma.groupchat.findMany();
            if (data)
                return data;
            else
                throw new HttpException('Groupschat not found', HttpStatus.NOT_FOUND);

        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get a all groupchat is not member
    async findAllGpnotmember(iduser: string): Promise<Groupchat[]> {
        try {
            const data = await this.prisma.groupchat.findMany(
                {
                    where: {
                        usersgb: { none: { id: iduser } },
                    },
                }
            );
            if (data)
                return data;
            else
            throw new HttpException('Groupschat not found', HttpStatus.NOT_FOUND);
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }
    //get groupchats of a user pasing  iduser
    async findAllGpuser(iduser: string): Promise<Groupchat[]> {
        try {
            const data = await this.prisma.groupchat.findMany(
                {
                    where: {
                        usersgb: { some: { id: iduser } },
                    },
                }
            );
            if (data)
                return data;
            else
                throw new HttpException('Groupschat not found', HttpStatus.NOT_FOUND);
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get all groupchat of a user
    async findAll(iduser: string) : Promise<Groupchat[]>{
        try {

            const data = await this.prisma.groupchat.findMany(
                {
                    where: {
                        usersgb: { some: { id: iduser } },
                    },
                }
            );
            if (data)
                return data;
            else
                console.log("no groupchat found");
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }


    //get all groupchat of a useradmin
    async findgpadmin(iduser: string) : Promise<Groupchat[]>{
        try {
            //get all groupchat where user is admin
            const data = await this.prisma.groupchat.findMany(
                {
                    where: {
                        admins: { some: { id: iduser } },
                    },
                }
            );
            if (data) {
                return data;
            }
            else
                console.log("no groupchat found");
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get all users of a groupchat if not admin
    async findAllUsers(id: string) : Promise<User[]> {
        try {
            const data = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    usersgb: true,
                    admins: true,
                },
            });
            if (data) {
                var users = [];
                data.usersgb.forEach(user => {
                    let check = false;
                    data.admins.forEach(admin => {
                        if (user.id != admin.id) {
                            check = true;
                        }
                    });
                    if (check) {
                        users.push(user);
                    }
                });
                return users;
            }
            else
                return [];
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get all admins of a groupchat
    async findAllAdmins(id: string): Promise<User[]> {
        try {
            const data = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    admins: true,
                },
            });

            return data.admins;
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get all messages of a groupchat
    async findAllMessages(id: string, iduserconnected: string): Promise<Messagegb[]> {
        try {
            //get user is blocked
            const userblock = await this.prisma.user.findUnique({
                where: {
                    id: iduserconnected,
                },
                select: {
                    blocked: true,
                    blockedby: true,
                },
            });
            console.log(userblock);
            const messages = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    messagesgb: true,
                },
            });
            var messagessend = [];
            messages.messagesgb.forEach(element => {
                let check = true;
                userblock.blocked.forEach(user => {
                    if (element.senderid == user.id) 
                        check = false;
                });
                userblock.blockedby.forEach(user => {
                    if (element.senderid == user.id)
                        check = false;
                });
                if (check) {
                    messagessend.push(element);
                }
            });
            return messagessend;

        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }
    //get superuser of a groupchat
    async findSuperUser(id: string): Promise<User> {
        try {
            const data =  await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    superadmin: true,
                },
            });
            return data.superadmin;
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get userban of a groupchat
    async findUserBan(id: string): Promise<User[]> {
        try {
            const data =  await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    usersblock: true,
                },
            });
            return data.usersblock;
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //get usermute of a groupchat
    async findUserMute(id: string) : Promise<usermute[]> {

        try {
            const data = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    usersmute: true,
                },
            });
            return data.usersmute;
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }


    //get Requestjoingroup of a groupchat
    async findRequestjoingroup(id: string) : Promise<Requestjoingroup[]> {

        try {
            return await this.prisma.requestjoingroup.findMany({
                where: {
                    receiverId: id,
                },
            });
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }



    //create a groupchat
    async create(createGroupchatDto: any, iduser: string) {
        try {
            const namegp = await this.prisma.groupchat.findUnique({
                where: {
                    namegb: createGroupchatDto.namegb,
                },
            });

            if (namegp == null) {
                if (createGroupchatDto.password) {
                    const saltOrRounds = 10;
                    createGroupchatDto.password = await bcrypt.hash(createGroupchatDto.password, saltOrRounds);
                }
                const data =  await this.prisma.groupchat.create({
                    data: {
                        namegb: createGroupchatDto.namegb,
                        usersgb: { connect: [{ id: iduser }] },
                        admins: { connect: [{ id: iduser }] },
                        superadmin: { connect: { id: iduser } },
                        grouptype: createGroupchatDto.grouptype,
                        password: createGroupchatDto.password,
                    },
                });
                if(data)
                    throw new HttpException('Groupchat created', HttpStatus.CREATED);
                else
                    throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
            }
            else {
                throw new HttpException('name of Groupchat already exist', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);
        }
    }

    //upload a image to a groupchat
    async uploadimage(filename: string, id: string, iduserconnected: string) {
        //get sueperadmin of the groupchat

        try {
            const superadmin = await this.findSuperUser(id);
            if (superadmin.id == iduserconnected) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        image: filename,
                    },
                });
            }
            else {
                throw new HttpException('You are not the superadmin of this groupchat', HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            console.log("image not uploaded");
            throw new HttpException('image not upload', HttpStatus.BAD_REQUEST);
        }
    }

    //update a groupchat
    async update(id: string, updateGroupchatDto: any, iduserconnected: string) {
        try {
            if (updateGroupchatDto.password) {
                const saltOrRounds = 10;
                updateGroupchatDto.password = await bcrypt.hash(updateGroupchatDto.password, saltOrRounds);
            }
            //get all admins of the groupchat
            const admins = await this.findAllAdmins(id);
            //check if the user is an admin of the groupchat
            var admin = false;
            admins.forEach(element => {
                if (element.id == iduserconnected) {
                    admin = true;
                }
            });
            if (admin) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        namegb: updateGroupchatDto.namegb,
                        grouptype: updateGroupchatDto.grouptype,
                        password: updateGroupchatDto.password,
                    },
                });
            }
            else {
                throw new HttpException('You are not the admin of this groupchat', HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new HttpException('Error in Request', HttpStatus.BAD_REQUEST);                                                                                            
        }
    }

    //ban a user from a groupchat
    async banuser(id: string, iduser: string, iduserconnected: string) {
        try {
            const admins = await this.findAllAdmins(id);
            //check if the user is an admin of the groupchat
            var admin = false;
            admins.forEach(element => {
                if (element.id == iduserconnected) {
                    admin = true;
                }
            });
            if (admin) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        usersblock: { connect: [{ id: iduser }] },
                        usersgb: { disconnect: [{ id: iduser }] },
                    },
                });
            }
            else {
                return "You are not the admin of this groupchat";
            }
        }
        catch (error) {
            return null;
        }
    }

    //mute a user from a groupchat
    async muteuser(id: string, iduser: string, iduserconnected: string, time: number) {
        const admins = await this.findAllAdmins(id);
        //check if the user is an admin of the groupchat
        var admin = false;
        admins.forEach(element => {
            if (element.id == iduserconnected) {
                admin = true;
            }
        });
        if (admin) {
            return await this.prisma.usermute.create({
                data: {
                    user: { connect: { id: iduser } },
                    groupchat: { connect: { id: id } },
                    expiresAt: new Date(Date.now() + time),
                },
            });
        }
        else {
            return "You are not the admin of this groupchat";
        }
    }

    //add a user to a groupchat public

    async adduser(id: string, iduserconnected: string) {
        //get user ban of the groupchat
        const userban = await this.findUserBan(id);
        //check if the user is not banned
        var notban = true;
        userban.forEach(element => {
            if (element.id == iduserconnected) {
                notban = false;
            }
        });
        if (notban) {
            return await this.prisma.groupchat.update({
                where: {
                    id: id,
                },
                data: {
                    usersgb: { connect: { id: iduserconnected } },
                },
            });
        }
        else {
            return "You are banned from this groupchat";
        }
    }

    //add a user to a groupchat protected
    async adduserprotected(id: string, pass: string, iduserconnected: string) {

        //get user ban of the groupchat
        const userban = await this.findUserBan(id);
        //check if the user is not banned
        var notban = true;
        userban.forEach(element => {
            if (element.id == iduserconnected) {
                notban = false;
            }
        });
        if (notban) {
            const groupchat = await this.prisma.groupchat.findUnique({
                where: {
                    id: id,
                },
                select: {
                    password: true,
                },
            });
            const validPassword = await bcrypt.compare(pass, groupchat.password);
            if (validPassword) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        usersgb: { connect: { id: iduserconnected } },
                    },
                });
            }
            else {
                return "Wrong password";
            }
        }
        else {
            return "You are banned from this groupchat";
        }

    }

    //accept a request to join a groupchat
    async acceptrequest(id: string, iduser: string, iduserconnected: string) {
        const superadmin = await this.findSuperUser(id);
        //select the request
        const request = await this.prisma.requestjoingroup.findFirst({
            where: {
                AND: [
                    { senderId: iduser },
                    { receiverId: superadmin.id },
                ],
            },
        });
        //delete the request
        await this.prisma.requestjoingroup.delete({
            where: {
                id: request.id,
            },
        });
        if (superadmin.id == iduserconnected) {
            await this.prisma.requestjoingroup
            return await this.prisma.groupchat.update({
                where: {
                    id: id,
                },
                data: {
                    usersgb: { connect: [{ id: iduser }] },
                },
            });
        }
        else {
            return "You are not the admin of this groupchat";
        }
    }

    //refuse a request to join a groupchat
    async refuserequest(id: string, iduser: string, iduserconnected: string) {
        const superadmin = await this.findSuperUser(id);

        //select the request
        const request = await this.prisma.requestjoingroup.findFirst({
            where: {
                AND: [
                    { senderId: iduser },
                    { receiverId: superadmin.id },
                ],
            },
        });
        //delete the request
        await this.prisma.requestjoingroup.delete({
            where: {
                id: request.id,
            },
        });
        if (superadmin.id == iduserconnected) {
            return "Request refused";
        }
        else {
            return "You are not the admin of this groupchat";
        }
    }

    ////////////////////////////////////////////////
    //add an admin to a groupchat
    async addadmin(id: string, iduser: string, iduserconnected: string) {
        //get sueperadmin of the groupchat
        const superadmin = await this.findSuperUser(id);
        if (superadmin.id == iduserconnected) {
            return await this.prisma.groupchat.update({
                where: {
                    id: id,
                },
                data: {
                    admins: { connect: [{ id: iduser }] },
                },
            });
        }
        else {
            return "You are not the superadmin of this groupchat";
        }
    }

    //delete a groupchat
    async remove(id: string, iduserconnected: string) {
        const superadmin = await this.findSuperUser(id);  
        //delete all messages of the groupchat
        await this.prisma.messagegb.deleteMany({
            where: {
                idgp: id,
            },
        });
        //delete all useersmute of the groupchat
        await this.prisma.usermute.deleteMany({
            where: {
                groupchatId: id,
            },
        });
        if (superadmin.id == iduserconnected) {
            return await this.prisma.groupchat.delete({
                where: {
                    id: id,
                },
            });
        }
        else {
            return "You are not the superadmin of this groupchat";
        }
    }

    //delete a user from a groupchat
    async removeuser(id: string, iduser: string, iduserconnected: string) {
        //get all admins of the groupchat
        const admins = await this.findAllAdmins(id);

        //check if the userconnected  is an admin of the groupchat
        var admin = false;
        admins.forEach(element => {
            if (element.id == iduserconnected) {
                admin = true;
            }
        });

        //check if the user not an admin of the groupchat
        var notadmin = true;
        admins.forEach(element => {
            if (element.id == iduser) {
                notadmin = false;
            }
        });

        if (admin || iduserconnected == iduser || notadmin) {
            return await this.prisma.groupchat.update({
                where: {
                    id: id,
                },
                data: {
                    usersgb: { disconnect: [{ id: iduser }] },
                },
            });
        }
    }

    //exit a groupchat
    async exit(id: string, iduserconnected: string) {
        try {

            //check if the userconnected  is a superadmin of the groupchat
            const superadmin = await this.findSuperUser(id);
            if (superadmin.id == iduserconnected) {
                //delete all messages of the groupchat
                await this.prisma.messagegb.deleteMany({
                    where: {
                        idgp: id,
                    },
                });
                return await this.prisma.groupchat.delete({
                    where: {
                        id: id,
                    },
                });
            }

            // get all admins of the groupchat
            const admins = await this.findAllAdmins(id);
            //check if the userconnected  is an admin of the groupchat
            if (admins.some(admin => admin.id == iduserconnected)) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        admins: { disconnect: [{ id: iduserconnected }] },
                    },
                });
            }


            return await this.prisma.groupchat.update({
                where: {
                    id: id,
                },
                data: {
                    usersgb: { disconnect: [{ id: iduserconnected }] },
                },
            });
        } catch (error) {
            return null;
        }
    }

    //delete an admin from a groupchat
    async removeadmin(id: string, iduser: string, iduserconnected: string) {

        try { //get sueperadmin of the groupchat
            const superadmin = await this.findSuperUser(id);
            if ((superadmin.id == iduserconnected || iduserconnected == iduser) && iduserconnected != superadmin.id) {
                return await this.prisma.groupchat.update({
                    where: {
                        id: id,
                    },
                    data: {
                        admins: { disconnect: [{ id: iduser }] },
                    },
                });
            }
            else {
                return "You are not the superadmin of this groupchat";
            }
        } catch (error) {
            return null;
        }
    }


    //////check if user is expired mute ///////

    @Cron('*/5 * * * * *')
    async expiremute() {
        try {
            const usermute = await this.prisma.usermute.findMany({
                where: {
                    expiresAt: { lte: new Date() },
                },
            });
            usermute.forEach(element => {
                const data = this.prisma.usermute.delete({
                    where: {
                        id: element.id,
                    },
                });
            });
        }
        catch (error) {
        }
    }
}

