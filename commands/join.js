const Discord = require('discord.js');
module.exports = {
    name: 'join',
    aliases: ['가입', 'ㅓㅐㅑㅜ', 'rkdlq'],
    description: '돈 서비스에 가입해요.',
    usage: '화베야 가입',
    run: async (client, message, args, ops) => {
        if (await client.db.findOne({_id: message.author.id})) {
            message.channel.send('이미 가입되어 있어요!')
        } else {
            await client.db.insertOne({_id: message.author.id, money: 0});
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('가입 완료!')
                .setDescription('이제 화베의 돈 서비스를 이용해보세요!')
                .setColor('RANDOM')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            );
        }
    }
}