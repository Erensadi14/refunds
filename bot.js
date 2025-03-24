require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('❌ Database verbinding mislukt:', err);
        process.exit(1);
    }
    console.log('✅ Database verbonden!');
});

client.once('ready', () => {
    console.log('✅ Bot is online!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'refund') {
        const identifier = interaction.options.getString('identifier');
        const item = interaction.options.getString('item');
        const bewijs = interaction.options.getString('bewijs') || 'Geen bewijs';

        db.query('INSERT INTO refunds (identifier, item, bewijs) VALUES (?, ?, ?)', 
            [identifier, item, bewijs], 
            (err) => {
                if (err) return interaction.reply('❌ Er ging iets mis met het opslaan.');
                interaction.reply(`✅ Refund opgeslagen voor **${identifier}**: ${item}`);
            });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
