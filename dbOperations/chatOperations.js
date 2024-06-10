var models = require("../models/index");
const randomToken = require("rand-token");
const { Op } = require("sequelize");
class chatOperations {
  constructor() {}
  async createRoom(room_name){
    let roomExist = await models.chatroom.findOne({where:{room_name:room_name}});
    if(roomExist){
      return false;
    }
    else{
        return await models.chatroom.create({room_name:room_name});
    }
  }
  async getRoom(room_name){
    let roomExist = await models.chatroom.findOne({where:{room_name:room_name}});
    if(roomExist){
        return roomExist;
        }
    else{
        return false;
        }
    }
    async getRooms(){
        return await models.chatroom.findAll();
    }
    async getMessages(room_name){
      console.log(room_name);
      try{
        
        let roomExist = await models.chatroom.findOne({where:{room_name:room_name}});
        if(roomExist){
          return await models.message.findAll({where:{room_name:room_name}});
        }
        else{
          return false;
        }
      }
      catch(err){
        return false;
      }
    }
    async storeMessage(model){
        let roomExist = await models.chatroom.findOne({where:{room_name:model.room_name}});
        if(roomExist){
            return await models.message.create(model);
        }
        else{
            return false;
        }
    }
}
exports.chatOperations = chatOperations;