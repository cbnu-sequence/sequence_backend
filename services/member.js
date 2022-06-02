const {TEAMS} = require("../constants");
const createError = require('http-errors');

exports.verifyTeam = (team) => {
    if(!TEAMS.includes(team)) {
        throw createError(400, "해당 팀이 존재하지 않습니다.");
    }
}
