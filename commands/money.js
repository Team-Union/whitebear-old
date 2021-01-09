const Discord = require('discord.js');
module.exports = {
    name: 'money',
    aliases: ['돈', 'ㅡㅐㅜ됴', 'ehs'],
    description: '현재 가진 돈을 확인해요.',
    usage: '화베야 돈',
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
            const embed = new Discord.MessageEmbed()
            .setTitle('돈 정보')
            .setDescription(`지금 ${(await client.db.findOne({_id: message.author.id})).money}원을 갖고 있어요.`)
            .setColor('RANDOM')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            message.channel.send(embed);
        }
    }
}