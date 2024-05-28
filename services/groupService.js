const Group = require('../database/entities/Group');

const getAllGroups = () => {
    return Group.getAllGroups();
}

const getGroup = (idGroup) => {
    return Group.getGroup(idGroup);
}

const addGroup = (newGroup) => {
    return Group.addGroup(newGroup)
}

const updateGroup = (newGroup) => {
    return Group.updateGroup(newGroup)
}

const deleteGroup = (idGroup) => {
    return Group.deleteGroup(idGroup)
}


module.exports= {
    getAllGroups,
    getGroup,
    addGroup,
    updateGroup,
    deleteGroup
}