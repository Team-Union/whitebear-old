const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();
const ascii = require('ascii-table');
const table = new ascii().setHeading('Command', 'Load Status');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const ops = require('./config.json');
const MongoDB = require('mongodb');
const DBClient = new MongoDB.MongoClient(`mongodb+srv://user:${process.env.DB_PASS}@whitebear3.tzso2.mongodb.net/whitebear3?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});
client.db = undefined;
DBClient.connect().then(() => {
    client.db = DBClient.db('whitebear3').collection('main');
});
fs.readdir('./commands/', (err, list) => {
    for (let file of list) {
        try {
            let pull = require(`./commands/${file}`);
            if (pull.name && pull.run && pull.aliases) {
                table.addRow(file, '✅');
                for (let alias of pull.aliases) {
                    client.aliases.set(alias, pull.name);
                }
                client.commands.set(pull.name, pull);
            } else {
                table.addRow(file, '❌ -> Error');
                continue;
            }
        } catch (e) { 
            table.addRow(file, `❌ -> ${e}`); 
            continue;
        }
    }
    console.log(table.toString());
});
client.on('ready', () => {
    console.log(`Login ${client.user.username}\n-----------------------`);
});
client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type != 'text' && message.channel.type != 'news') return;
    if (!message.content.startsWith(ops.prefix)) return;
    message.channel.startTyping(1);
    let args = message.content.substr(ops.prefix.length).trim().split(' ');
    if (client.commands.get(args[0])) {
        client.commands.get(args[0]).run(client, message, args, ops);
    } else if (client.aliases.get(args[0])) {
        client.commands.get(client.aliases.get(args[0])).run(client, message, args, ops);
    } else {
        let s = 0;
        let sname = undefined;
        let typed = args[0];
        let valids = [];
        for (let x of client.commands.array()) {
            for (let y of x.aliases) {
                valids.push(y);
            }
            valids.push(x.name);
        }
        for (let curr of valids) {
            let cnt = 0;
            let i = 0;
            for (let curlet of curr.split('')) {
                if (curlet[i] && typed.split('')[i] && curlet[i] == typed.split('')[i]) {
                    cnt++;
                }
                i++;
            }
            if (cnt > s) {
                s = cnt;
                sname = curr;
            }
        }
        if (sname) {
            let msgClone = message;
            let argsClone = args;
            argsClone[0] = `${ops.prefix}${sname}`;
            msgClone.content = message.content.replace(typed, sname);
            let m = await message.channel.send({
                embed: new Discord.MessageEmbed()
                .setTitle('명령어 자동 수정')
                .setColor('RANDOM')
                .setDescription('입력한 명령어는 존재하지 않아요.\n대신 아래 명령어를 대신 실행하까요?')
                .addField('실행할 명령어', msgClone.content)
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            });
            await m.react('✅');
            await m.react('❌');
            const filter = (r, u) => (r.emoji.name == '✅' || r.emoji.name == '❌') && u.id == message.author.id;
            const collector = m.createReactionCollector(filter, {
                max: 1
            });
            collector.on('end', collected => {
                m.delete();
                if (collected.first().emoji.name == '✅') {
                    (client.commands.get(sname) || client.commands.get(client.aliases.get(sname))).run(client, msgClone, argsClone, ops);
                }
            });
        }
    }
    message.channel.stopTyping(true);
});
client.login(process.env.TOKEN);