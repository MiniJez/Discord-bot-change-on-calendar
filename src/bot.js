const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('../config/config.js');
const jsdom = require('jsdom');
const request = require('request-promise-native');

const moment = require('moment');
moment.locale('fr');

const scheduledTask = require('./scheduled-task');

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token).then(() => {
    console.log('You are connected!');
});

scheduledTask.jokeOfTheDay();
scheduledTask.save2WeekInLocalData();
scheduledTask.compareSchedules();

client.on('message', message => {
    const today = moment();
    let date;
    let msg = '';

    switch (message.content) {
    case '!today':
        processForOneFixedDay(today, msg, message);
        break;
    case '!tomorrow':
        date = today.clone();
        date.date(date.date() + 1);
        processForOneFixedDay(date, msg, message);
        break;
    case '!week':
        date = today.clone();
        processForAWeekFixedDate(date, msg, message);
        break;
    case '!nextweek':
        date = today.clone();
        date.weekday(7);
        processForAWeekFixedDate(date, msg, message);
        break;
    case '!infos':
        message.channel.send('Ce bot discord à pour objectif d\'éviter au __maximum__ d\'utiliser ce fabuleux outil qu\'est ~~je vous pisse dessus sans même vous faire croire qu\'il pleut~~ BEECOME.\n\nCe que je sais faire :\n\n!today\n!tomorrow\n!week\n!nextweek\n!infos\n\nJe vous préviens également de chaque changement dans l\'emplois du temps sur les 2 prochaines semaines !   :muscle::muscle:\nAlors, elle est pas belle la vie ?   :heart_eyes:\n\nJe suis __open source__ ! : Github https://github.com/MiniJez/Discord-bot-displaying-epsi-calendar-changes\nAuteur : Edouard CLISSON.');
    }
});

async function getData (url) {
    return request(url);
}

function getLessonInfos (htmlBody, msg, date) {
    const { JSDOM } = jsdom;
    const dom = new JSDOM(htmlBody);
    const $ = (require('jquery'))(dom.window);

    let dayOfWeek = moment(date).format('dddd');
    dayOfWeek = firstLetterToUpper(dayOfWeek);
    let month = moment(date).format('MMMM');
    month = firstLetterToUpper(month);

    const tab = $('.Ligne');

    for (let i = 0; i < tab.length; i++) {
        var dateLesson = `${dayOfWeek} ${date.date()} ${month}`;
        const matiere = $($(tab[i]).find('.Matiere')).html();
        const debut = $($(tab[i]).find('.Debut')).html();
        const fin = $($(tab[i]).find('.Fin')).html();
        const prof = $($(tab[i]).find('.Prof')).html();
        const salle = $($(tab[i]).find('.Salle')).html();

        msg += `${dateLesson} : **${matiere}** de __${debut}__ à __${fin}__ en salle __${salle}__ avec **${prof}**\n`;
    }

    if (tab.length === 0) {
        msg += `${dayOfWeek} ${date.date()} ${month} : Aucun cours prévu !\n`;
    }

    return msg;
}

function getUrl (day, month, year) {
    return `http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=i&tel=edouard.clisson&date=${month}/${day}/${year}%208:00`;
}

function sendMessage (message, msg) {
    message.channel.send(msg);
}

function firstLetterToUpper (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitMessage (msg) {
    const halfLength = Math.floor(msg.length / 2);
    const startMsg = msg.slice(0, halfLength);
    const endMsg = msg.slice(halfLength, msg.length);

    const splittedMsg = [];

    splittedMsg.push(startMsg);
    splittedMsg.push(endMsg);

    return splittedMsg;
}

async function processForOneFixedDay (date, msg, message) {
    const url = getUrl(date.date(), date.month() + 1, date.year());
    const htmlBody = await getData(url);
    msg = getLessonInfos(htmlBody, msg, date);

    sendMessage(message, msg);
}

async function processForAWeekFixedDate (date, msg, message) {
    for (let i = 0; i < 5; i++) {
        date.weekday(i);
        const url = getUrl(date.date(), date.month() + 1, date.year());
        const htmlBody = await getData(url);
        msg = getLessonInfos(htmlBody, msg, date) + '\n';
    }

    if (msg.length > 2000) {
        const splittedMsg = splitMessage(msg);

        splittedMsg.forEach(str => {
            sendMessage(message, str);
        });
    } else {
        sendMessage(message, msg);
    }
}

module.exports.client = client;
module.exports.getData = getData;
module.exports.getUrl = getUrl;
module.exports.firstLetterToUpper = firstLetterToUpper;
module.exports.splitMessage = splitMessage;
