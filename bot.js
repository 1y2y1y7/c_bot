const Discord = require('discord.js');
const client = new Discord.Client();
const api_key = 'oUaarQits42wH7VJUsyX4FOOcwd9vX6h'

const disbut = require('discord-buttons');

client.once("ready",
    () => {
        console.log(`Logged`);
        // client.channels.cache.get('1034340020552749150').bulkDelete(100, true);
        // client.channels.cache.get('1034340020552749150').send('d')
        client.channels.cache.get('1065517499581481070').bulkDelete(100, true);//test server
        client.channels.cache.get('1065517499581481070').send('on');
    });

client.on('message',
    message => {
        const axios = require("axios");//npm install axios
        var returnValue = null
        var playerId = null
        if (message.author.username != "샆봇") {
            if (message.channel.name.indexOf('봇') != -1) {
                message.channel.bulkDelete(100, true);
                if (message.content.startsWith("/ㄴㄱ ") || message.content.startsWith("/sr ")) {
                    var nick = message.content.split(' ')[1]
                    var arrr = [0, 0, 0, 0];
                    //&startDate=2022-09-01 00:00&endDate=2022-09-21 23:59
                    axios.get(encodeURI('https://api.neople.co.kr/cy/players?nickname=' + nick + '&apikey=' + api_key))
                        .then(response => {
                            returnValue = response.data.rows[0].grade + '급'
                            message.channel.send(returnValue)
                            if (response.data.rows[0] != undefined) {
                                playerId = response.data.rows[0].playerId
                                axios.get(encodeURI('https://api.neople.co.kr/cy/players/' + playerId + '/matches?gameTypeId=normal&limit=100&apikey=' + api_key))
                                    .then(response => {
                                        for (var i = 0; i < response.data.matches.rows.length; i++) {
                                            switch (response.data.matches.rows[i].position.name) {
                                                case '원거리딜러':
                                                    arrr[0]++
                                                    break;
                                                case '근거리딜러':
                                                    arrr[1]++
                                                    break;
                                                case '탱커':
                                                    arrr[2]++
                                                    break;
                                                case '서포터':
                                                    arrr[3]++
                                                    break;
                                            }
                                        }
                                        var arrPosition = [];
                                        arrPosition[0] = arrr[0] != 0 ? parseInt(arrr[0] / response.data.matches.rows.length * 100) : 0
                                        arrPosition[1] = arrr[1] != 0 ? parseInt(arrr[1] / response.data.matches.rows.length * 100) : 0
                                        arrPosition[2] = arrr[2] != 0 ? parseInt(arrr[2] / response.data.matches.rows.length * 100) : 0
                                        arrPosition[3] = arrr[3] != 0 ? parseInt(arrr[3] / response.data.matches.rows.length * 100) : 0
                                        message.channel.send(
                                            '원딜 : ' + arrPosition[0] + '% / ' +
                                            '탱커 : ' + arrPosition[1] + '% / ' +
                                            '근딜 : ' + arrPosition[2] + '% / ' +
                                            '서폿 : ' + arrPosition[3] + '%')
                                        if (response.data.matches.rows.length != 0) {
                                            var win, lose, stop, total, rating = 0
                                            if (response.data.records.length == 2) {
                                                win = response.data.records[0].winCount
                                                lose = response.data.records[0].loseCount
                                                stop = response.data.records[0].stopCount
                                            }
                                            total = win + lose + stop
                                            rating = parseInt(win / total * 100)
                                            if (isNaN(rating)) {
                                                rating = 0
                                                win = 0
                                                lose = 0
                                                stop = 0
                                            }
                                            message.channel.send('공식 승률 : ' + rating + '% (' + win + '승 ' + lose + '패 ' + stop + '이탈)')

                                            win, lose, stop, total, rating = 0
                                            if (response.data.records.length == 2) {
                                                win = response.data.records[1].winCount
                                                lose = response.data.records[1].loseCount
                                                stop = response.data.records[1].stopCount
                                            } else {
                                                win = response.data.records[0].winCount
                                                lose = response.data.records[0].loseCount
                                                stop = response.data.records[0].stopCount
                                            }
                                            total = win + lose + stop
                                            rating = parseInt(win / total * 100)
                                            if (isNaN(rating)) {
                                                rating = 0
                                                win = 0
                                                lose = 0
                                                stop = 0
                                            }
                                            message.channel.send('일반 승률 : ' + rating + '% (' + win + '승 ' + lose + '패 ' + stop + '이탈)')
                                        } else {
                                            message.channel.send('전적 없음')
                                        }
                                    })
                            } else {
                                message.channel.send('아이디 없음')
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                }
                else if (message.content.startsWith("//")) {
                    var nick = message.content.split('//')[1]
                    var character = null
                    var arrr = [];
                    if (nick.split(' ')[1] != undefined) {
                        character = nick.split(' ')[1]
                        nick = nick.split(' ')[0]
                    }

                    axios.get(encodeURI('https://api.neople.co.kr/cy/players?nickname=' + nick + '&apikey=' + api_key))
                        .then(response => {
                            if (response.data.rows[0] != undefined) {
                                playerId = response.data.rows[0].playerId
                                // axios.get(encodeURI('https://api.neople.co.kr/cy/players/' + playerId + '/matches?gameTypeId=normal&apikey=' + api_key))
                                axios.get(encodeURI('https://api.neople.co.kr/cy/players/' + playerId + '/matches?gameTypeId=normal&limit=100&apikey=' + api_key))
                                    .then(response => {
                                        //https://api.neople.co.kr/cy/players/887df547365df578619aa7404a52da5c/matches?gameTypeId=normal&apikey=oUaarQits42wH7VJUsyX4FOOcwd9vX6h
                                        message.channel.send("\"" + nick + "\"계정 일반전 기록")
                                        for (var i = 0; i < response.data.matches.rows.length; i++) {
                                            var index = a => a.char == response.data.matches.rows[i].playInfo.characterName
                                            if (arrr.findIndex(index) == -1) {
                                                arrr[arrr.length] = {
                                                    cnt: 1,
                                                    char: response.data.matches.rows[i].playInfo.characterName,
                                                    level: response.data.matches.rows[i].playInfo.level,
                                                    k: response.data.matches.rows[i].playInfo.killCount,
                                                    a: response.data.matches.rows[i].playInfo.assistCount,
                                                    d: response.data.matches.rows[i].playInfo.deathCount,
                                                    result: [response.data.matches.rows[i].playInfo.result]
                                                }
                                            } else {
                                                arrr[arrr.findIndex(index)].cnt++
                                                arrr[arrr.findIndex(index)].level = arrr[arrr.findIndex(index)].level + response.data.matches.rows[i].playInfo.level
                                                arrr[arrr.findIndex(index)].k = arrr[arrr.findIndex(index)].k + response.data.matches.rows[i].playInfo.killCount
                                                arrr[arrr.findIndex(index)].a = arrr[arrr.findIndex(index)].a + response.data.matches.rows[i].playInfo.assistCount
                                                arrr[arrr.findIndex(index)].d = arrr[arrr.findIndex(index)].d + parseInt(response.data.matches.rows[i].playInfo.deathCount)
                                                arrr[arrr.findIndex(index)].result.push(response.data.matches.rows[i].playInfo.result)
                                            }
                                        }
                                        arrr.sort(function (a, b) { return b.cnt - a.cnt })
                                        // console.log(arrr)
                                        if (arrr.length != 0) {
                                            if (character != null) {
                                                for (var i = 0; i < arrr.length; i++) {
                                                    if (arrr[i].char == character) {
                                                        var w = 0
                                                        var l = 0
                                                        for (var j = 0; j < arrr[i].result.length; j++) {
                                                            if (arrr[i].result[j] == "win") {
                                                                w++
                                                            } else {
                                                                l++
                                                            }
                                                        }
                                                        if (arrr[i] != undefined) {
                                                            message.channel.send(
                                                                arrr[i].char + ' ' +
                                                                arrr[i].cnt + '전 ' +
                                                                w + '승 ' + l + '패' + ' 평균' +
                                                                parseInt(arrr[i].level / arrr[i].cnt) + '렙 (' +
                                                                (arrr[i].k / arrr[i].cnt).toFixed(1) + '킬 ' +
                                                                (arrr[i].a / arrr[i].cnt).toFixed(1) + '어시 ' +
                                                                (arrr[i].d / arrr[i].cnt).toFixed(1) + '데스)'
                                                            )
                                                        }
                                                    }
                                                }
                                            } else {
                                                var len = arrr.length
                                                if (len > 5) {
                                                    len = 5
                                                }
                                                for (var i = 0; i < len; i++) {
                                                    var w = 0
                                                    var l = 0
                                                    for (var j = 0; j < arrr[i].result.length; j++) {
                                                        if (arrr[i].result[j] == "win") {
                                                            w++
                                                        } else {
                                                            l++
                                                        }
                                                    }
                                                    if (arrr[i] != undefined) {
                                                        message.channel.send(
                                                            arrr[i].char + ' ' +
                                                            arrr[i].cnt + '전 ' +
                                                            w + '승 ' + l + '패' + ' 평균' +
                                                            parseInt(arrr[i].level / arrr[i].cnt) + '렙 (' +
                                                            (arrr[i].k / arrr[i].cnt).toFixed(1) + '킬 ' +
                                                            (arrr[i].a / arrr[i].cnt).toFixed(1) + '어시 ' +
                                                            (arrr[i].d / arrr[i].cnt).toFixed(1) + '데스)'
                                                        )
                                                    }
                                                }
                                            }
                                        } else {
                                            message.channel.send('전적 없음')
                                        }
                                    })
                            } else {
                                message.channel.send('아이디 없음')
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                }
                else if (message.content.startsWith("..")) {
                    var nick = message.content.split('..')[1]
                    var character = null
                    var arrr = [];
                    if (nick.split(' ')[1] != undefined) {
                        character = nick.split(' ')[1]
                        nick = nick.split(' ')[0]
                    }

                    axios.get(encodeURI('https://api.neople.co.kr/cy/players?nickname=' + nick + '&apikey=' + api_key))
                        .then(response => {
                            if (response.data.rows[0] != undefined) {
                                playerId = response.data.rows[0].playerId
                                // axios.get(encodeURI('https://api.neople.co.kr/cy/players/' + playerId + '/matches?gameTypeId=normal&apikey=' + api_key))
                                axios.get(encodeURI('https://api.neople.co.kr/cy/players/' + playerId + '/matches?gameTypeId=rating&limit=100&apikey=' + api_key))
                                    .then(response => {
                                        //https://api.neople.co.kr/cy/players/887df547365df578619aa7404a52da5c/matches?gameTypeId=normal&apikey=oUaarQits42wH7VJUsyX4FOOcwd9vX6h
                                        message.channel.send("\"" + nick + "\"계정 공식전 기록")
                                        for (var i = 0; i < response.data.matches.rows.length; i++) {
                                            var index = a => a.char == response.data.matches.rows[i].playInfo.characterName
                                            if (arrr.findIndex(index) == -1) {
                                                arrr[arrr.length] = {
                                                    cnt: 1,
                                                    char: response.data.matches.rows[i].playInfo.characterName,
                                                    level: response.data.matches.rows[i].playInfo.level,
                                                    k: response.data.matches.rows[i].playInfo.killCount,
                                                    a: response.data.matches.rows[i].playInfo.assistCount,
                                                    d: response.data.matches.rows[i].playInfo.deathCount,
                                                    result: [response.data.matches.rows[i].playInfo.result]
                                                }
                                            } else {
                                                arrr[arrr.findIndex(index)].cnt++
                                                arrr[arrr.findIndex(index)].level = arrr[arrr.findIndex(index)].level + response.data.matches.rows[i].playInfo.level
                                                arrr[arrr.findIndex(index)].k = arrr[arrr.findIndex(index)].k + response.data.matches.rows[i].playInfo.killCount
                                                arrr[arrr.findIndex(index)].a = arrr[arrr.findIndex(index)].a + response.data.matches.rows[i].playInfo.assistCount
                                                arrr[arrr.findIndex(index)].d = arrr[arrr.findIndex(index)].d + parseInt(response.data.matches.rows[i].playInfo.deathCount)
                                                arrr[arrr.findIndex(index)].result.push(response.data.matches.rows[i].playInfo.result)
                                            }
                                        }
                                        arrr.sort(function (a, b) { return b.cnt - a.cnt })
                                        if (arrr.length != 0) {
                                            if (character != null) {
                                                for (var i = 0; i < arrr.length; i++) {
                                                    if (arrr[i].char == character) {
                                                        var w = 0
                                                        var l = 0
                                                        for (var j = 0; j < arrr[i].result.length; j++) {
                                                            if (arrr[i].result[j] == "win") {
                                                                w++
                                                            } else {
                                                                l++
                                                            }
                                                        }
                                                        if (arrr[i] != undefined) {
                                                            message.channel.send(
                                                                arrr[i].char + ' ' +
                                                                arrr[i].cnt + '전 ' +
                                                                w + '승 ' + l + '패' + ' 평균' +
                                                                parseInt(arrr[i].level / arrr[i].cnt) + '렙 (' +
                                                                (arrr[i].k / arrr[i].cnt).toFixed(1) + '킬 ' +
                                                                (arrr[i].a / arrr[i].cnt).toFixed(1) + '어시 ' +
                                                                (arrr[i].d / arrr[i].cnt).toFixed(1) + '데스)'
                                                            )
                                                        }
                                                    }
                                                }
                                            } else {
                                                var len = arrr.length
                                                if (len > 5) {
                                                    len = 5
                                                }
                                                for (var i = 0; i < len; i++) {
                                                    var w = 0
                                                    var l = 0
                                                    for (var j = 0; j < arrr[i].result.length; j++) {
                                                        if (arrr[i].result[j] == "win") {
                                                            w++
                                                        } else {
                                                            l++
                                                        }
                                                    }
                                                    if (arrr[i] != undefined) {
                                                        message.channel.send(
                                                            arrr[i].char + ' ' +
                                                            arrr[i].cnt + '전 ' +
                                                            w + '승 ' + l + '패' + ' 평균' +
                                                            parseInt(arrr[i].level / arrr[i].cnt) + '렙 (' +
                                                            (arrr[i].k / arrr[i].cnt).toFixed(1) + '킬 ' +
                                                            (arrr[i].a / arrr[i].cnt).toFixed(1) + '어시 ' +
                                                            (arrr[i].d / arrr[i].cnt).toFixed(1) + '데스)'
                                                        )
                                                    }
                                                }
                                            }
                                        } else {
                                            message.channel.send('전적 없음')
                                        }
                                    })
                            } else {
                                message.channel.send('아이디 없음')
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                }
                //  else if ((message.content == "clear" || message.content == "칟ㅁㄱ") && message.author.username == "ㅈㅌㅈㅌ") {
                //     message.channel.bulkDelete(100, true);
                // }
            }
        }
    });

client.login('');

