const Discord = require('discord.js');
module.exports = {
    name: 'getmoney',
    aliases: ['돈받기', '돈내놔', '돈줘', 'ㅎㄷ스ㅐㅜ됴', 'ehsqkerl', 'ehssoshk', 'ehswnj'],
    description: '1시간에 한번씩 돈을 받아요.',
    usage: '화베야 돈받기',
    run: async (client, message, args, ops) => {
        if (!(await client.db.findOne({_id: message.author.id}))) {
            const embed = new Discord.MessageEmbed()
            .setTitle('화베의 돈 서비스에 가입되어있지 않아요.')
            .setDescription('`화베야 가입`을 이용해서 먼저 가입해주세요!')
            .setColor('RANDOM')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            message.channel.send(embed);
        } else {
            if ((await client.db.findOne({_id: message.author.id})).lastGotMoney && new Date() - 1 + 1 - (await client.db.findOne({_id: message.author.id})).lastGotMoney < 3600000) {
                const embed = new Discord.MessageEmbed()
                .setTitle('1시간 전에 이미 돈을 받았어요')
                .setDescription(`${(3600000 - (new Date() - 1 + 1 - ((await client.db.findOne({_id: message.author.id}))).lastGotMoney)) / 1000|0}초 후에 다시 시도해 주세요!`)
                .setColor('RANDOM')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                message.channel.send(embed);
            } else {
                await client.db.updateOne({_id: message.author.id}, {
                    $set: {
                        lastGotMoney: new Date() - 1 + 1,
                        money: ((await client.db.findOne({_id: message.author.id})).money + 10000)
                    }
                });
                const embed = new Discord.MessageEmbed()
                .setTitle('10000원을 받았어요!')
                .setDescription(`현재 보유 금액은 ${(await client.db.findOne({_id: message.author.id})).money}원이에요.`)
                .setColor('RANDOM')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                message.channel.send(embed);
            }
        }
    }
}