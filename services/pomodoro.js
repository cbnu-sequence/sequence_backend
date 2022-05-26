const Pomodoro = require("../models/pomodoro");
exports.getPomodorosRankingByTime = async (startDate, endDate) =>{
    const doc = await Pomodoro.aggregate([
        {
            $match: {
                endDate: {$gte: startDate, $lt: endDate},
                isFinished: true,
            }
        },
        {
            $group: {
                _id:"$writer",
                count:{
                    $sum:1
                },
                pomodoro: {
                    $last: "$$ROOT"
                },
                sequence: {
                    $max: "$sequence",
                },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user"
        },
        // {
        //     $addFields: {
        //         "pomodoro.time": {
        //             $divide: [
        //                 {
        //                     $subtract: [
        //                         "$pomodoro.endDate",
        //                         "$pomodoro.startDate",
        //                     ]
        //                 },
        //                 60000,
        //             ]
        //         }
        //     }
        // },
        {
            $project : {
                "user._id": 1,
                "user.email": 1,
                "user.name": 1,
                "count": 1,
                "pomodoro.title": 1,
                "pomodoro.startDate": 1,
                "pomodoro.endDate": 1,
                "pomodoro.time": 1,
                "sequence": 1,
            }
        },
        {
            $sort : {
                count : -1,
                sequence: -1,
            }
        }
    ])

    return doc;
}

exports.getWeekFirstDay = (date) => {
    let dayOfWeek = date.getDay();
    if(dayOfWeek == 0) {
        dayOfWeek = 7;
    }
    return new Date(date.setDate(date.getDate() - dayOfWeek + 1))
}

exports.getWeekLastDay = (date) => {
    let dayOfWeek = date.getDay();
    if(dayOfWeek == 0) {
        dayOfWeek = 7;
    }
    return new Date(date.setDate(date.getDate() + (7 - dayOfWeek) + 1))
}
