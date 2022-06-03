const {TEAMS, PARTS} = require("../constants");
const createError = require('http-errors');

exports.verifyTeam = (team) => {
    if(!TEAMS.includes(team)) {
        throw createError(400, "해당 팀이 존재하지 않습니다.");
    }
}

exports.verifyParts = (part) => {
    if(!PARTS.includes(part)) {
        throw createError(400, "해당 역할이 존재하지 않습니다.");
    }
}
