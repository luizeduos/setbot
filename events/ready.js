export default function (client) {
    client.once('ready', () => {
        console.log(`✅ Bot online como ${client.user.tag}`);
        client.user.setActivity('Aguardando /set', { type: 2 }); // type 2 = LISTENING

    });
}
